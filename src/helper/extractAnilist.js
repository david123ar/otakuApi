// Function to create a slug from a string
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric characters with hyphens
    .replace(/(^-|-$)/g, '');     // Remove leading and trailing hyphens
}

// Function to fetch data from AniList
async function fetchAniListData(pageId) {
  try {
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title {
            romaji
            english
          }
          description
          bannerImage
          episodes
          status
          genres
          averageScore
          startDate {
            year
          }
        }
      }`;

    const variables = { id: pageId };

    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('AniList Data:', responseData); // Debug log
    return responseData.data.Media;
  } catch (error) {
    console.error('Error fetching AniList data:', error.message);
    throw error;
  }
}

// Function to fetch data from New Gogo
async function fetchNewGogoData(slug) {
  try {
    const url = `https://newgogo.vercel.app/${encodeURIComponent(slug)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('New Gogo Data:', data); // Debug log

    // Check if results exist and are an array
    if (data && Array.isArray(data.results)) {
      return data.results; // Return the results array
    } else {
      console.warn('No results found or results is not an array.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching New Gogo data:', error.message);
    throw error;
  }
}

// Helper function to extract year from release date string
function extractYearFromReleaseDate(releaseDate) {
  const match = releaseDate.match(/Released: (\d{4})/);
  return match ? parseInt(match[1], 10) : null;
}

// Helper function to compare release years
function compareReleaseYears(aniListYear, newGogoYear) {
  return aniListYear === newGogoYear;
}

// Helper function to find the dub ID
function findDubId(results, aniListYear) {
  return results.find(result => 
    result.id.includes('dub') &&
    compareReleaseYears(aniListYear, extractYearFromReleaseDate(result.releaseDate))
  )?.id || null;
}

// Helper function to find the matching result based on year
function findMatchingResult(results, aniListYear) {
  return results.find(result => 
    compareReleaseYears(aniListYear, extractYearFromReleaseDate(result.releaseDate))
  );
}

// Main function to extract and combine data from both APIs
async function extractPage(pageId) {
  try {
    // Fetch data from AniList
    const aniListData = await fetchAniListData(pageId);
    console.log('Fetched AniList Data:', aniListData); // Debug log

    if (!aniListData) {
      console.warn('No data found from AniList for ID:', pageId);
      return {
        success: true,
        results: {
          data: {
            newGogoId: null,
            dubId: null,
            aniListId: null,
            title: null,
            titleDub: null,
            slug: "",
            description: null,
            bannerImage: null,
            episodes: null,
            status: null,
            genres: null,
            averageScore: null,
            releaseYearMatch: false
          }
        }
      };
    }

    // Create a slug from the title
    const title = aniListData.title.romaji || aniListData.title.english;
    const slug = createSlug(title);
    console.log('Generated Slug:', slug); // Debug log

    // Fetch data from New Gogo using the slug
    const newGogoData = await fetchNewGogoData(slug);
    console.log('Fetched New Gogo Data:', newGogoData); // Debug log

    // Find the matching result based on release year
    const matchingResult = findMatchingResult(newGogoData, aniListData.startDate.year);
    console.log('Matching Result:', matchingResult); // Debug log

    // Find the dub ID based on release year
    const dubId = findDubId(newGogoData, aniListData.startDate.year);
    console.log('Found Dub ID:', dubId); // Debug log

    // Create and return a combined data object
    const data = {
      newGogoId: matchingResult ? matchingResult.id : null,
      dubId: dubId,
      aniListId: aniListData.id,
      title: title,
      titleDub: aniListData.title.english,
      slug: slug,
      description: aniListData.description,
      bannerImage: aniListData.bannerImage,
      episodes: aniListData.episodes,
      status: aniListData.status,
      genres: aniListData.genres,
      averageScore: aniListData.averageScore,
      releaseYearMatch: Boolean(matchingResult)
    };

    return {
      success: true,
      results: { data }
    };
  } catch (error) {
    console.error(`Error extracting data for page ID ${pageId}:`, error.message);
    return {
      success: false,
      message: error.message
    };
  }
}

// Export the function
export default extractPage;

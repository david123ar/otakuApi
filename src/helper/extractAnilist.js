import axios from "axios";

// Function to create a slug from a string
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric characters with hyphens
    .replace(/(^-|-$)/g, '');     // Remove leading and trailing hyphens
}

async function extractPage(pageId) {
  try {
    // Define the GraphQL query
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
      }
    }`;

    // Define the variables for the query
    const variables = {
      id: pageId,
    };

    // Make the request to the AniList GraphQL API
    const response = await axios.post('https://graphql.anilist.co', {
      query: query,
      variables: variables,
    });

    // Extract the necessary data
    const mediaData = response.data.data.Media;
    console.log(response.data)

    // Create a slug from the title
    const title =  mediaData.title.romaji;
    const slug = createSlug(title);

    // Create and return a data object
    const data = {
      id: mediaData.id,
      title: title,
      slug: slug,  // Add slug to the data object
      description: mediaData.description,
      bannerImage: mediaData.bannerImage,
      episodes: mediaData.episodes,
      status: mediaData.status,
      genres: mediaData.genres,
      averageScore: mediaData.averageScore,
    };

    return data; // Return the extracted data
  } catch (error) {
    console.error(`Error extracting data from page ${pageId}:`, error.message);
    throw error;
  }
}

export default extractPage;

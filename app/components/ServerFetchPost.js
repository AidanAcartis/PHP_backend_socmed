// Function to fetch post data from a JSON file
export async function ServerFetchPost() {
    try {
        const response = await fetch('http://localhost:3002/Devoi_socila_media/src/backend/controllers/posts/posts.json');
        if (!response.ok) {
            console.error('Error fetching post data:', response.statusText);
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching post data:', error);
        return null;
    }
}

// Function to fetch post data from a JSON file
export async function ServerFetchComments() {
    try {
        const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/comments/comments.json');
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

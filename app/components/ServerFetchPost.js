// Function to fetch post data from a JSON file
export async function ServerFetchPost() {
    try {
        console.log('Fetching post data...');
        const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/posts/createPost/posts.json');
        
        if (!response.ok) {
            console.error('Error fetching post data:', response.statusText);
            return null;
        }

        console.log('Post data fetched successfully, parsing JSON...');
        const data = await response.json();

        console.log('Post data parsed successfully:', data);
        return data;
    } catch (error) {
        console.error('Error fetching post data:', error);
        return null;
    }
}

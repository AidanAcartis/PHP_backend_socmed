import Layout from "../../components/forPages/PageLayout";
import PostCard from "../../components/forPages/PostCard";

export  default function SavedPostsPage() {
    return(
        <Layout>
            <h1 className="text-5xl mb-4 text-gray-300">Saved post</h1>
            <PostCard />
            <PostCard />
        </Layout>
    );
}
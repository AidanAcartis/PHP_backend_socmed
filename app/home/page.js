import Layout from "../components/forPages/PageLayout";
import PostCard from "../components/forPages/PostCard";
import PostFormCard from "../components/forPages/createPosts/PostFormCard";

export default function Home() {
  return (
    <Layout>
      <PostFormCard />
      <PostCard />
    </Layout>
  );
}

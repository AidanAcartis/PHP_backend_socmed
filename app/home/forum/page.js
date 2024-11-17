import Forum from "../../api/chat/Forum";
import Card from "../../components/forPages/Cards";
import Layout from "../../components/forPages/PageLayout";


export default function ForumPage() {
    return(
       <Layout>
            <Card>
                <div>
                    <Forum />
                </div>
            </Card>
       </Layout>
    );
}
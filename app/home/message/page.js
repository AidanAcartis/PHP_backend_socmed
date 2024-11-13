import PrivateChat from "../../api/chat/chatPrivate";
import Card from "../../components/forPages/Cards";
import Layout from "../../components/forPages/PageLayout";


export default function NotificationsPage() {
    return(
        <Layout>
            <Card>
                <div>
                    <PrivateChat />
                </div>
            </Card>
        </Layout>
    );
}
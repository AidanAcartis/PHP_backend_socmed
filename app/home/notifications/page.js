import Avatar from "../../components/forPages/Avatar";
import Card from "../../components/forPages/Cards";
import Layout from "../../components/forPages/PageLayout";
import Link from "next/link";

export default function NotificationsPage() {
    return(
        <Layout>
            <h1 className="text-5xl mb-4 text-gray-300 p-3">Notifications</h1>
            <Card>
                <div className="-mx-4 grid gap-4 p-2">
                    <div className="flex gap-2 border-b p-4 pt-1 border-b-gray-100 -mx-4">
                        <Link href={'/home/profile'}>
                           <Avatar />
                        </Link>
                        <div>
                            <Link href={''} className="font-semibold mr-1 hover:underline">Shiro </Link>
                            liked 
                            <Link href={''} className="text-socialBlue hover:underline ml-1">your photo</Link>.
                        </div>
                    </div>
                    <div className="flex gap-2 border-b p-4 pt-1 border-b-gray-100 -mx-4">
                        <Link href={'/home/profile'}>
                           <Avatar />
                        </Link>
                        <div>
                            <Link href={''} className="font-semibold mr-1 hover:underline">Shiro </Link>
                            liked 
                            <Link href={''} className="text-socialBlue hover:underline ml-1">your photo</Link>.
                        </div>
                    </div>
                    <div className="flex gap-2 border-b p-4 pt-1 border-b-gray-100 -mx-4">
                        <Link href={'/home/profile'}>
                           <Avatar />
                        </Link>
                        <div>
                            <Link href={''} className="font-semibold mr-1 hover:underline">Shiro </Link>
                            liked 
                            <Link href={''} className="text-socialBlue hover:underline ml-1">your photo</Link>.
                        </div>
                    </div>
                </div>
            </Card>
        </Layout>
    );
}
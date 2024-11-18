'use client';

import { useEffect, useState } from "react";
import Layout from "./PageLayout";
import Card from "./Cards";
import Avatar from "./Avatar";
import Link from "next/link";
import { getUserProfilePhoto } from "../forOtherUser/newComponents/otherProfilePhoto";
import ProfilePhotoCard from "../forOtherUser/newComponents/ProfilePhotoCard";

const NotificationCard = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch("http://localhost/Devoi_socila_media/src/backend/api/displayNotification/updateNotif.php", {
                    method: "GET",
                    credentials: "include", // Assure que les cookies de session sont envoyés
                });
                const data = await response.json();
                console.log("Voici les infos sur les notifications non lues", data);

                if (response.ok) {
                    setNotifications(data);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <Layout>
            <h1 className="text-5xl mb-4 text-gray-300 p-3">Notifications</h1>
            <Card>
                {loading ? (
                    <div>Chargement...</div>
                ) : (
                    <div className="-mx-4 grid gap-4 p-2">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => {
                                let message;
                                switch (notification.type) {
                                    case "reaction":
                                        message = (
                                            <>
                                                a réagi à votre{" "}
                                                <Link href={`/home/comments?postId=${notification.post_id}`} className="text-blue-500 hover:underline">
                                                    post
                                                </Link>.
                                            </>
                                        );
                                        break;
                                    case "follow":
                                        message = ` vous a suivi.`;
                                        break;
                                    case "comment":
                                        message = (
                                            <>
                                                a commenté votre{" "}
                                                <Link href={`/home/comments?postId=${notification.post_id}`} className="text-blue-500 hover:underline">
                                                    post
                                                </Link>.
                                            </>
                                        );
                                        break;
                                    case "new_post":
                                        message = (
                                            <>
                                                a publié une nouvelle{" "}
                                                <Link href={`/home/post?postId=${notification.post_id}&userId=${notification.actor_id}`} className="text-blue-500 hover:underline">
                                                    publication
                                                </Link>.
                                            </>
                                        );
                                        break;
                                    case "comment_reaction":
                                        message = (
                                            <>
                                                a réagi à votre{" "}
                                                <Link href={`/home/post?postId=${notification.post_id}&userId=${notification.post_owner}`} className="text-blue-500 hover:underline">
                                                    commentaire
                                                </Link>.
                                            </>
                                        );
                                        break;
                                    case "signalement":
                                            message = (
                                                <>
                                                    a rapporté une {" "}
                                                    <Link href={`/home/signalement?signalementId=${notification.signalement_id}`} className="text-blue-500 hover:underline">
                                                        plainte
                                                    </Link>.
                                                </>
                                            );
                                            break;
                                    // Ajoutez d'autres cas selon les types de notifications
                                    default:
                                        message = ` a effectué une action.`;
                                        break;
                                }

                                return (
                                    <div key={notification.id} className="flex items-center gap-4 border-b p-4 pt-1 border-b-gray-100 -mx-4">
                                        <Link href={`/home/followedPage?userId=${notification.actor_id}`}>
                                            <ProfilePhotoCard userId={notification.actor_id} />
                                        </Link>
                                        <div>
                                            <Link href={`/home/followedPage?userId=${notification.actor_id}`} className="font-semibold mr-1 hover:underline">
                                                {notification.username}
                                            </Link>
                                            {message}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div>Aucune notification non lue</div>
                        )}
                    </div>
                )}
            </Card>
        </Layout>
    );
};

export default NotificationCard;

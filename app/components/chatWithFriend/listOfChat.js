import Card from "../forPages/Cards";
import FriendToTalk from "./AllFriends";

const numberOfFriends = 1;

export default function ListOfChat() {
    return (
            
            <div className="gap-6 justify-center items-center">
                {Array.from({length: numberOfFriends}).map((_, index) =>(
                    <FriendToTalk key={index} />
                ))}
            </div>
    );
}
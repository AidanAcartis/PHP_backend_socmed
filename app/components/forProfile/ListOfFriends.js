import Card from "../forPages/Cards";
import FriendInfo from "./FriendInfo";

const numberOfFriends = 10;

export default function ListOfFriend() {
    return (
        
        <Card>
            
            <div className="grid gap-6 grid-cols-2 justify-center items-center">
                {Array.from({length: numberOfFriends}).map((_, index) =>(
                    <FriendInfo key={index} />
                ))}
            </div>
        </Card>
    );
}
import Avatar from "../forPages/Avatar";

export default function FriendInfo() {
    return (
        <div className="flex gap-2 border-b p-4 border-b-gray-100 -mx-4">
              <Avatar />
              <div>
                <h2 className="font-bold text-xl text-md">Nekonya</h2>
                <div className="text-sm leading-4">5 mutuals friends</div>
              </div>
        </div>
    );
}
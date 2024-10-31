export default function Cover({url, editable}) {
    {/*<div className="h-56 overflow-hidden flex justify-center items-start">
            <img src={url} alt="cover image"/>
        </div>*/}
    function updateCover() {

    }
    return (
        <div className="h-56 overflow-hidden flex justify-center items-start relative">
            <div>
               <img src="https://static.zerochan.net/Anteater.Team.full.2361473.jpg" alt="cover image"/>
            </div>
            {editable && (
                <div className="absolute right-8 bottom-8 m-2">
                    <label className="flex gap-1 items-center bg-white py-1 px-2 rounded-md shadow-md shadow-black cursor-pointer">
                        <input type="file" className="hidden"/>
                        {/*<svg w-5 h-5 px-2></svg>*/}
                        Change Cover image
                    </label>
                </div>
            )}
            <div className="absolute right-8 bottom-8 m-2">
                    <label className="flex gap-1 items-center bg-white py-1 px-2 rounded-md shadow-md shadow-black cursor-pointer">
                        <input type="file" className="hidden"/>
                        {/*<svg w-5 h-5 px-2></svg>*/}
                        Change Cover image
                    </label>
                </div>
       </div>
    );
}
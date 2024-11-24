// pages/resources/index.js

import Articles from "./articles";
import Guide from "./guidePage";
import Organizations from "./organisationPage";


export default function Resources() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white">
      <div className="container mx-auto py-10 px-5">
        <h1 className="text-4xl font-bold text-center mb-10 text-white drop-shadow-lg">
          Centre de Ressources
        </h1>
        
        <Guide />
        
        <div className="my-10">
          <Articles />
        </div>
        
        <div className="my-10">
          <Organizations />
        </div>
      </div>
    </div>
  );
}

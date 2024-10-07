/* eslint-disable @next/next/no-img-element */

export default function Avatar({size}) {
    let width = 'w-12 h-12';  // Taille par défaut

    // Gérer la taille de l'avatar en fonction du paramètre 'size'
    if (size === 'lg') {
        width = 'w-12 md:w-24';  // Taille plus grande si 'lg' est passé en paramètre
    } else if (size === 'sm') {
        width = 'w-8';  // Taille plus petite si 'sm' est passé en paramètre
    }

    return (
        <div className={`${width} rounded-full overflow-hidden`}>
            <img 
                src="https://static.miraheze.org/allthetropeswiki/0/0b/Girls_und_Panzer_-_Nekonyaa.png" 
                alt="avatar" 
            />
        </div>
    );
}

import React from 'react';

const ClickOutHandler = ({onClickOut, children}) => {
const ref = React.useRef();

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if(ref.current && !ref.current.contains(event.target)){
                onClickOut();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return() => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClickOut]);
    return <div ref={ref}>{children}</div>;
};
export default ClickOutHandler;
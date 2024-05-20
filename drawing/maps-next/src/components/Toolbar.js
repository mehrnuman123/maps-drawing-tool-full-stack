import React from 'react';

const Toolbar = ({ onDrawShape, onSelect, onEraseShape, onSave }) => {
    return (
        <div className="toolbar">
            <div className='shapes-container'>
                <div className='shapes'>
                    <b>Shapes</b>
                </div>
                <div className='shapes-icons'>
                    <img className='hover-icon' src="/rect.svg" alt="My SVG" width="20" height="20" onClick={() => onDrawShape('Rectangle')} />
                    <img className='hover-icon' src="/circle.svg" alt="My SVG" width="20" height="20" onClick={() => onDrawShape('Circle')} />
                    <img className='hover-icon' src="/star.svg" alt="My SVG" width="20" height="20" onClick={() => onDrawShape('LineString')} />
                    <img className='hover-icon' src="/eraser.svg" alt="My SVG" width="20" height="20" onClick={onEraseShape} />
                    <img className='hover-icon' src="/cursor.svg" alt="My SVG" width="20" height="20" onClick={onSelect} />
                    <button onClick={onSave}> Save</button>
                </div>

            </div>
        </div>
    );
};

export default Toolbar;

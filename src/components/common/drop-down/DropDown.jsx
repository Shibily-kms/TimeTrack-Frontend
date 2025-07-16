import React, { useEffect, useRef, useState } from 'react';
import './drop-down.scss'
import SingleButton from '../buttons/SingleButton';

const DropDown = ({ items = [], mainButton }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 'left', y: 'bottom' });

  const wrapperRef = useRef();
  const menuRef = useRef();

  const calculatePosition = () => {
    const button = wrapperRef.current;
    const menu = menuRef.current;
    if (!button || !menu) return;

    const btnRect = button.getBoundingClientRect();
    const menuHeight = menu.offsetHeight;
    const menuWidth = menu.offsetWidth;
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;

    const maxHeight = window.innerHeight - btnRect.bottom - 20;
    menu.style.maxHeight = `${maxHeight}px`;

    // Vertical: top or bottom
    const y = (btnRect.bottom + menuHeight > screenHeight) ? 'top' : 'bottom';

    // Horizontal: left / center / right
    let x = 'left';
    const spaceRight = screenWidth - btnRect.left;
    const spaceLeft = btnRect.right;

    if (spaceRight >= menuWidth && spaceLeft >= menuWidth) x = 'center';
    else if (spaceRight >= menuWidth) x = 'left';
    else if (spaceLeft >= menuWidth) x = 'right';

    setPosition({ x, y });
  };

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (open) {
      calculatePosition();
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
      setOpen(false);
    }
  };

  //  const items = [
  //         {
  //             heading: 'General',
  //             items: [
  //                 { label: 'View', icon: <FaEye />, onClick: () => alert('View Clicked') },
  //                 { label: 'Edit', icon: <FaEdit />, onClick: () => alert('Edit Clicked') },
  //             ],
  //         },
  //         {
  //             heading: 'Actions',
  //             items: [
  //                 { label: 'Add', icon: <FaPlus />, theme: 'primary', onClick: () => alert('Add Clicked') },
  //                 { label: 'Delete', icon: <FaTrash />, theme: 'danger', onClick: () => alert('Delete Clicked') },
  //                 { label: 'Disabled Item', disabled: true },
  //             ],
  //         }
  //     ];

  return (
    <div className="dropdown-wrapper" ref={wrapperRef}>

      <SingleButton name={mainButton?.label} onClick={toggleDropdown} classNames={mainButton?.className}
        style={mainButton?.style} />

      {open && (
        <div
          className={`dropdown-menu ${position.x} ${position.y}`}
          ref={menuRef}
        >
          {items.map((section, sectionIndex) => (
            <div key={sectionIndex} className="dropdown-section">
              {section.heading && (
                <>
                  <div className="dropdown-heading">{section.heading}</div>
                  <div className="dropdown-divider" />
                </>
              )}
              {section.items.map((item, idx) =>
                item.type === 'divider' ? (
                  <div key={idx} className="dropdown-divider" />
                ) : (
                  <div
                    key={idx}
                    className={`dropdown-item ${item.disabled ? 'disabled' : ''} ${item.theme || ''}`}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.icon && <span className="icon">{item.icon}</span>}
                    <span className="label">{item.label}</span>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown
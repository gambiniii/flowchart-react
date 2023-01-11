import React from 'react';
import './Sidebar.css'

export default ({ onSave, onRestore }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div>
        <div className="description">You can drag these nodes to the pane on the right.</div>
        
        <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
          Input Node
        </div>

        <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
          Default Node
        </div>

        <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
          Output Node
        </div>

        <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'group')} draggable>
          Group Node
        </div>
      </div>


      <div className="save__controls">
        <button className='form-button save' onClick={onSave}>Salvar</button >
        <button className='form-button restore' onClick={onRestore}>Restaurar</button>
      </div>


    </aside>
  );
};

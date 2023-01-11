import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
    applyEdgeChanges,
    applyNodeChanges,
    addEdge,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    Controls,
    useReactFlow,

} from 'reactflow';

import 'reactflow/dist/style.css';

import Sidebar from '../Sidebar';

import { initialNodes, initialEdges } from './nodes.js';

const flowKey = 'example-flow';

let id = 4
const getId = () => `${id++}`

function Flow() {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const { setViewport } = useReactFlow();


    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const onConnect = useCallback(
        (connection) => {
            setEdges((eds) => addEdge({ ...connection, animated: true }, eds))
        },
        [setEdges]
    );


    //DRAG N' DROP
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const newNode = {
                id: getId(),
                type,
                position,
                data: { label: `${type} node` },
            };

            console.log(newNode)

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );


    // SAVE N' RESTORE
    const onSave = useCallback(() => {
        if (reactFlowInstance) {
            console.log('SUCESSO!')


            const flow = reactFlowInstance.toObject();
            localStorage.setItem(flowKey, JSON.stringify(flow));

            console.log(flow)

        }
    }, [reactFlowInstance])

    const onRestore = useCallback(() => {
        const restoreFlow = async () => {
            const flow = JSON.parse(localStorage.getItem(flowKey));

            console.log(flow)

            if (flow) {
                const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                setViewport({ x, y, zoom });
            }

        };

        restoreFlow()
    }, [setNodes, setViewport])



    return (
        <>
            <div className="dndflow">
                <ReactFlowProvider>
                    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onInit={setReactFlowInstance}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            fitView
                        >
                            <Controls />

                        </ReactFlow>
                    </div>


                    <Sidebar
                        onSave={onSave}
                        onRestore={onRestore}
                    >
                    </Sidebar>



                </ReactFlowProvider>
            </div>
        </>
    );
}

function FlowWithProvider(props) {
    return (
        <ReactFlowProvider>
            <Flow {...props} />
        </ReactFlowProvider>
    );
}


export default FlowWithProvider;

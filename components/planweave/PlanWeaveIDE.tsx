'use client';

import { useState } from 'react';
import { ChatPanel } from './ChatPanel';
import { CodeEditor } from './CodeEditor';
import { TopBar } from './TopBar';
import type { Message, PlanNode, FileItem } from '@/types/planweave';

const initialFiles: FileItem[] = [
  {
    name: 'main.ts',
    path: 'src/main.ts',
    language: 'typescript',
    content: `/* Game of Life
 * Implemented in TypeScript
 * To learn more about TypeScript, please visit http://www.typescriptlang.org/
 */

namespace Conway {

	export class Cell {
		public row: number;
		public col: number;
		public live: boolean;

		constructor(row: number, col: number, live: boolean) {
			this.row = row;
			this.col = col;
			this.live = live;
		}
	}

	export class GameOfLife {
		private gridSize: number;
		private canvasSize: number;
		private lineColor: string;
		private liveColor: string;
		private deadColor: string;
		private initialLifeProbability: number;
		private animationRate: number;
		private cellSize: number;
		private context: CanvasRenderingContext2D;
		private world;


		constructor() {
			this.gridSize = 50;
			this.canvasSize = 600;
			this.lineColor = '#cdcdcd';
			this.liveColor = '#666';
			this.deadColor = '#eee';
			this.initialLifeProbability = 0.5;
			this.animationRate = 60;
			this.cellSize = 0;
			this.world = this.createWorld();
			this.circleOfLife();
		}

		public createWorld() {
			return this.travelWorld( (cell : Cell) =>  {
				cell.live = Math.random() < this.initialLifeProbability;
				return cell;
			});
		}

		public circleOfLife() : void {
			this.world = this.travelWorld( (cell: Cell) => {
				cell = this.world[cell.row][cell.col];
				this.draw(cell);
				return this.resolveNextGeneration(cell);
			});
			setTimeout( () => {this.circleOfLife()}, this.animationRate);
		}

		public resolveNextGeneration(cell : Cell) {
			var count = this.countNeighbors(cell);
			var newCell = new Cell(cell.row, cell.col, cell.live);
			if(count < 2 || count > 3) newCell.live = false;
			else if(count == 3) newCell.live = true;
			return newCell;
		}

		public countNeighbors(cell : Cell) {
			var neighbors = 0;
			for(var row = -1; row <=1; row++) {
				for(var col = -1; col <= 1; col++) {
					if(row == 0 && col == 0) continue;
					if(this.isAlive(cell.row + row, cell.col + col)) {
						neighbors++;
					}
				}
			}
			return neighbors;
		}

		public isAlive(row : number, col : number) {
			if(row < 0 || col < 0 || row >= this.gridSize || col >= this.gridSize) return false;
			return this.world[row][col].live;
		}

		public travelWorld(callback) {
			var result = [];
			for(var row = 0; row < this.gridSize; row++) {
				var rowData = [];
				for(var col = 0; col < this.gridSize; col++) {
					rowData.push(callback(new Cell(row, col, false)));
				}
				result.push(rowData);
			}
			return result;
		}

		public draw(cell : Cell) {
			if(this.context == null) this.context = this.createDrawingContext();
			if(this.cellSize == 0) this.cellSize = this.canvasSize/this.gridSize;

			this.context.strokeStyle = this.lineColor;
			this.context.strokeRect(cell.row * this.cellSize, cell.col*this.cellSize, this.cellSize, this.cellSize);
			this.context.fillStyle = cell.live ? this.liveColor : this.deadColor;
			this.context.fillRect(cell.row * this.cellSize, cell.col*this.cellSize, this.cellSize, this.cellSize);
		}

		public createDrawingContext() {
			var canvas = <HTMLCanvasElement> document.getElementById('conway-canvas');
			if(canvas == null) {
					canvas = document.createElement('canvas');
					canvas.id = 'conway-canvas';
					canvas.width = this.canvasSize;
					canvas.height = this.canvasSize;
					document.body.appendChild(canvas);
			}
			return canvas.getContext('2d');
		}
	}
}

var game = new Conway.GameOfLife();
`
  },
];

export function PlanWeaveIDE() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 I'm your planning assistant. Let's break down what you want to build before we start coding.\n\nWhat are you working on?",
      timestamp: new Date(),
    }
  ]);
  
  const [planNodes, setPlanNodes] = useState<PlanNode[]>([]);
  const [showFlowchart, setShowFlowchart] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [currentFilePath, setCurrentFilePath] = useState('src/main.ts');

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsThinking(true);

    setTimeout(() => {
      const response = generatePlanResponse(content, messages.length);
      setMessages(prev => [...prev, response]);
      setIsThinking(false);
      
      if (messages.length >= 2 && !showFlowchart) {
        generatePlanNodes();
        setShowFlowchart(true);
      }
    }, 1200);
  };

  const generatePlanResponse = (userInput: string, messageCount: number): Message => {
    const responses = [
      {
        content: "Great! Let me help you plan this out. Here's how I think we should approach it:\n\n**Phase 1: Project Setup**\n- Initialize Next.js with TypeScript\n- Configure Tailwind CSS\n- Set up folder structure\n\n**Phase 2: Core Features**\n- Build authentication flow\n- Create user dashboard\n- Implement data fetching\n\nDoes this approach make sense? Any changes you'd like?",
        plan: true
      },
      {
        content: "Perfect! I've updated the plan. Let's dive into Phase 1:\n\n**Files to create:**\n```\napp/layout.tsx\napp/page.tsx\ncomponents/auth/LoginForm.tsx\nlib/auth.ts\n```\n\n**Key considerations:**\n- Use NextAuth.js for authentication\n- Store session in cookies\n- Protect routes with middleware\n\nShould I break this down further?",
        plan: true
      }
    ];

    const response = responses[Math.min(messageCount - 1, responses.length - 1)] || {
      content: "I understand. Let me refine the plan based on your feedback...",
      plan: false
    };

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      planUpdate: response.plan,
    };
  };

  const generatePlanNodes = () => {
    const nodes: PlanNode[] = [
      {
        id: 'start',
        type: 'start',
        label: 'Start Planning',
        x: 50,
        y: 50,
        children: ['phase1']
      },
      {
        id: 'phase1',
        type: 'phase',
        label: 'Project Setup',
        description: 'Initialize project structure',
        x: 50,
        y: 150,
        children: ['step1-1', 'step1-2'],
        expanded: true,
        status: 'pending'
      },
      {
        id: 'step1-1',
        type: 'step',
        label: 'Init Next.js',
        description: 'Set up Next.js 14 with App Router',
        x: 20,
        y: 280,
        children: ['phase2'],
        files: ['package.json', 'next.config.js'],
        status: 'pending'
      },
      {
        id: 'step1-2',
        type: 'step',
        label: 'Configure Tailwind',
        description: 'Add Tailwind CSS configuration',
        x: 80,
        y: 280,
        children: ['phase2'],
        files: ['tailwind.config.ts', 'globals.css'],
        status: 'pending'
      },
      {
        id: 'phase2',
        type: 'phase',
        label: 'Core Features',
        description: 'Build authentication & dashboard',
        x: 50,
        y: 410,
        children: ['step2-1'],
        expanded: false,
        status: 'pending'
      },
      {
        id: 'step2-1',
        type: 'step',
        label: 'Authentication',
        description: 'Implement user auth flow',
        x: 20,
        y: 540,
        children: [],
        files: ['lib/auth.ts', 'app/login/page.tsx'],
        status: 'pending'
      }
    ];

    setPlanNodes(nodes);
  };

  const toggleNodeExpansion = (nodeId: string) => {
    setPlanNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, expanded: !node.expanded }
        : node
    ));
  };

  const handleFileChange = (path: string, content: string) => {
    setFiles(prev => prev.map(file => 
      file.path === path ? { ...file, content } : file
    ));
  };

  const handleAddFile = () => {
    const fileName = prompt('Enter file name (e.g., components/Button.tsx):');
    if (!fileName) return;

    const extension = fileName.split('.').pop() || 'tsx';
    const language = extension === 'tsx' || extension === 'ts' ? 'typescript' : 
                     extension === 'jsx' || extension === 'js' ? 'javascript' :
                     extension === 'css' ? 'css' : 'typescript';

    const newFile: FileItem = {
      name: fileName.split('/').pop() || fileName,
      path: fileName,
      language,
      content: `// ${fileName}\n\n`
    };

    setFiles(prev => [...prev, newFile]);
    setCurrentFilePath(fileName);
  };

  const handleDeleteFile = (path: string) => {
    if (files.length <= 1) {
      alert('Cannot delete the last file');
      return;
    }
    
    setFiles(prev => prev.filter(f => f.path !== path));
    if (currentFilePath === path) {
      setCurrentFilePath(files[0].path);
    }
  };

  const handleRenameFile = (oldPath: string) => {
    const newPath = prompt('Enter new file path:', oldPath);
    if (!newPath || newPath === oldPath) return;

    setFiles(prev => prev.map(file => 
      file.path === oldPath 
        ? { ...file, path: newPath, name: newPath.split('/').pop() || newPath }
        : file
    ));

    if (currentFilePath === oldPath) {
      setCurrentFilePath(newPath);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <TopBar currentFile={currentFilePath} showFlowchart={showFlowchart} />
      
      <div className="flex-1 flex overflow-hidden">
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          isThinking={isThinking}
          showFlowchart={showFlowchart}
          onToggleFlowchart={() => setShowFlowchart(!showFlowchart)}
          planNodes={planNodes}
          onToggleNode={toggleNodeExpansion}
        />
        
        <CodeEditor
          files={files}
          currentFilePath={currentFilePath}
          onFileChange={handleFileChange}
          onFileSelect={setCurrentFilePath}
          onAddFile={handleAddFile}
          onDeleteFile={handleDeleteFile}
          onRenameFile={handleRenameFile}
        />
      </div>
    </div>
  );
}

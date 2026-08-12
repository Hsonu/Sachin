const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace .heroSliderViewport definition to add the vertical shadow overlay
content = content.replace(
  `.heroSliderViewport {
            position: relative;
            width: 100%;
            height: 100%;
            background: #01150A;
            border-radius: 0;
            border: none;
            box-shadow: none;
        }`,
  `.heroSliderViewport {
            position: relative;
            width: 100%;
            height: 100%;
            background: #01150A;
            border-radius: 0;
            border: none;
            box-shadow: none;
        }

        .heroSliderViewport::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, 
                rgba(1, 21, 10, 0.5) 0%, 
                rgba(1, 21, 10, 0) 18%, 
                rgba(1, 21, 10, 0) 80%, 
                rgba(1, 21, 10, 0.7) 100%
            );
            z-index: 3;
            pointer-events: none;
        }`
);

// Replace .heroSliderNav to push it up
content = content.replace(
  `        .heroSliderNav {
            position: absolute;
            bottom: 35px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
            display: flex;
            gap: 12px;
            justify-content: center;
        }`,
  `        .heroSliderNav {
            position: absolute;
            bottom: 95px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
            display: flex;
            gap: 12px;
            justify-content: center;
        }`
);

// Replace .heroThumb definitions to enhance visibility and shadow
content = content.replace(
  `        .heroThumb {
            width: 60px;
            height: 60px;
            border-radius: 10px;
            overflow: hidden;
            border: 2px solid transparent;
            cursor: pointer;
            transition: all var(--transition);
            opacity: 0.5;
            background: rgba(255, 255, 255, 0.05);
        }`,
  `        .heroThumb {
            width: 72px;
            height: 72px;
            border-radius: 12px;
            overflow: hidden;
            border: 2.5px solid rgba(255, 255, 255, 0.25);
            cursor: pointer;
            transition: all var(--transition);
            opacity: 0.7;
            background: rgba(1, 21, 10, 0.85);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
        }`
);

content = content.replace(
  `        .heroThumb:hover {
            opacity: 0.85;
            transform: translateY(-2px);
            border-color: rgba(217, 165, 42, 0.4);
        }`,
  `        .heroThumb:hover {
            opacity: 0.95;
            transform: translateY(-4px);
            border-color: rgba(217, 165, 42, 0.6);
            box-shadow: 0 10px 28px rgba(0, 0, 0, 0.7);
        }`
);

content = content.replace(
  `        .heroThumb.active {
            opacity: 1;
            border-color: var(--gold);
            box-shadow: 0 4px 14px rgba(217, 165, 42, 0.35);
            transform: translateY(-2px);
        }`,
  `        .heroThumb.active {
            opacity: 1;
            border-color: var(--gold);
            box-shadow: 0 8px 32px rgba(217, 165, 42, 0.5);
            transform: translateY(-4px);
        }`
);

// Replace .scrollIndicator to make it highly legible
content = content.replace(
  `        .scrollIndicator {
            position: absolute;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
            color: rgba(255, 255, 255, 0.4);
            font-size: 0.65rem;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            font-weight: 600;
            cursor: pointer;
            pointer-events: auto;
            transition: color var(--transition);
        }`,
  `        .scrollIndicator {
            position: absolute;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
            color: rgba(255, 255, 255, 0.85);
            font-size: 0.72rem;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            font-weight: 700;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
            cursor: pointer;
            pointer-events: auto;
            transition: color var(--transition);
        }`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully updated hero overlay shadows and thumbnail visibility!");

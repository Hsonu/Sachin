const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Find start and end positions of hero CSS block
const startIndex = content.indexOf('#heroSection {');

let endIndex = content.indexOf('/* ═══════════════════════════════════════════\r\n           FILTER BAR');
if (endIndex === -1) {
  endIndex = content.indexOf('/* ═══════════════════════════════════════════\n           FILTER BAR');
}

if (startIndex !== -1 && endIndex !== -1) {
  const newCSS = `#heroSection {
            position: relative;
            width: 100%;
            height: calc(100vh - var(--header-h));
            min-height: 500px;
            background: #01150A;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border-bottom: 1px solid var(--border);
        }

        .heroContainer {
            width: 70%;
            height: 80%;
            position: relative;
            max-width: 1300px;
            margin: 0 auto;
            border-radius: 20px;
            overflow: hidden;
            border: 1.5px solid rgba(217, 165, 42, 0.35);
            box-shadow: 0 24px 70px rgba(0, 0, 0, 0.7);
            background: #17301C;
        }

        .heroVisualCol {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        .heroSliderViewport {
            position: relative;
            width: 100%;
            height: 100%;
            background: #01150A;
        }

        .heroSliderViewport::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, 
                rgba(1, 21, 10, 0.45) 0%, 
                rgba(1, 21, 10, 0) 20%, 
                rgba(1, 21, 10, 0) 80%, 
                rgba(1, 21, 10, 0.65) 100%
            );
            z-index: 3;
            pointer-events: none;
        }

        .heroSlide {
            position: absolute;
            inset: 0;
            opacity: 0;
            z-index: 1;
            transition: opacity 0.8s ease-in-out;
            overflow: hidden;
        }

        .heroSlide.active {
            opacity: 1;
            z-index: 2;
        }

        .heroSlide img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            transform: scale(1.03);
            transition: transform 6s cubic-bezier(0.1, 1, 0.1, 1);
        }

        .heroSlide.active img {
            transform: scale(1.1);
        }

        .heroSliderNav {
            position: absolute;
            bottom: 95px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        .heroThumb {
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
        }

        .heroThumb:hover {
            opacity: 0.95;
            transform: translateY(-4px);
            border-color: rgba(217, 165, 42, 0.6);
            box-shadow: 0 10px 28px rgba(0, 0, 0, 0.7);
        }

        .heroThumb.active {
            opacity: 1;
            border-color: var(--gold);
            box-shadow: 0 8px 32px rgba(217, 165, 42, 0.5);
            transform: translateY(-4px);
        }

        .heroThumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* Scroll indicator */
        .scrollIndicator {
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
        }

        .scrollIndicator:hover {
            color: var(--gold);
        }

        .scrollIndicator::after {
            content: '';
            position: absolute;
            bottom: -12px;
            left: 50%;
            transform: translateX(-50%);
            width: 1px;
            height: 10px;
            background: currentColor;
            animation: scrollBounce 2s infinite;
        }

        @keyframes scrollBounce {
            0%, 100% {
                transform: translateX(-50%) translateY(0);
            }
            50% {
                transform: translateX(-50%) translateY(6px);
            }
        }

        @media (max-width: 900px) {
            #heroSection {
                height: 60vh;
                min-height: 400px;
            }
            .heroContainer {
                width: 92%;
                height: 85%;
            }
            .heroThumb {
                width: 56px;
                height: 56px;
            }
            .heroSliderNav {
                bottom: 80px;
            }
        }

        @media (max-width: 480px) {
            #heroSection {
                height: 50vh;
                min-height: 350px;
            }
            .heroThumb {
                width: 48px;
                height: 48px;
            }
        }

        `;

  content = content.substring(0, startIndex) + newCSS + content.substring(endIndex);
  console.log("Successfully updated hero CSS for 70% width framing!");
} else {
  console.log("Error: markers not found!", startIndex, endIndex);
}

fs.writeFileSync(filePath, content, 'utf8');

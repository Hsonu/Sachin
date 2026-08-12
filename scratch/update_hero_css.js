const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/index.html');
let content = fs.readFileSync(filePath, 'utf8');

// We find the index of `#heroSection {`
const startIndex = content.indexOf('#heroSection {');

// We find the index of `/* ═══════════════════════════════════════════\n           FILTER BAR` or with \r\n
let endIndex = content.indexOf('/* ═══════════════════════════════════════════\r\n           FILTER BAR');
if (endIndex === -1) {
  endIndex = content.indexOf('/* ═══════════════════════════════════════════\n           FILTER BAR');
}

if (startIndex !== -1 && endIndex !== -1) {
  const newCSS = `#heroSection {
            position: relative;
            width: 100%;
            height: calc(100vh - var(--header-h));
            min-height: 450px;
            background: #01150A;
            overflow: hidden;
            border-bottom: 1px solid var(--border);
        }

        .heroContainer {
            width: 100%;
            height: 100%;
            position: relative;
            max-width: 100%;
            padding: 0;
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
            border-radius: 0;
            border: none;
            box-shadow: none;
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
            bottom: 35px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        .heroThumb {
            width: 60px;
            height: 60px;
            border-radius: 10px;
            overflow: hidden;
            border: 2px solid transparent;
            cursor: pointer;
            transition: all var(--transition);
            opacity: 0.5;
            background: rgba(255, 255, 255, 0.05);
        }

        .heroThumb:hover {
            opacity: 0.85;
            transform: translateY(-2px);
            border-color: rgba(217, 165, 42, 0.4);
        }

        .heroThumb.active {
            opacity: 1;
            border-color: var(--gold);
            box-shadow: 0 4px 14px rgba(217, 165, 42, 0.35);
            transform: translateY(-2px);
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
            color: rgba(255, 255, 255, 0.4);
            font-size: 0.65rem;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            font-weight: 600;
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

        @media (max-width: 480px) {
            .heroThumb {
                width: 52px;
                height: 52px;
            }
        }

        `;

  content = content.substring(0, startIndex) + newCSS + content.substring(endIndex);
  console.log("Successfully updated hero style rules!");
} else {
  console.log("Error: markers not found!", startIndex, endIndex);
}

fs.writeFileSync(filePath, content, 'utf8');

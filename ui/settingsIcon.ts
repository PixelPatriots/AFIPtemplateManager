import { TemplateManager } from "../templateManager";
import * as utils from "../utils";
import { Settings } from "./settingsContainer";

let SLIDERS_SVG = '<svg draggable="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M0 416c0-17.7 14.3-32 32-32l54.7 0c12.3-28.3 40.5-48 73.3-48s61 19.7 73.3 48L480 384c17.7 0 32 14.3 32 32s-14.3 32-32 32l-246.7 0c-12.3 28.3-40.5 48-73.3 48s-61-19.7-73.3-48L32 448c-17.7 0-32-14.3-32-32zm192 0a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM384 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm-32-80c32.8 0 61 19.7 73.3 48l54.7 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-54.7 0c-12.3 28.3-40.5 48-73.3 48s-61-19.7-73.3-48L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l246.7 0c12.3-28.3 40.5-48 73.3-48zM192 64a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm73.3 0L480 64c17.7 0 32 14.3 32 32s-14.3 32-32 32l-214.7 0c-12.3 28.3-40.5 48-73.3 48s-61-19.7-73.3-48L32 128C14.3 128 0 113.7 0 96S14.3 64 32 64l86.7 0C131 35.7 159.2 16 192 16s61 19.7 73.3 48z"/></svg>'

export async function init(manager: TemplateManager | null) {
    let settings = new Settings(manager);

    let xKey = `${window.location.host} settingsX`
    let yKey = `${window.location.host} settingsY`
    let x = await GM.getValue(xKey, null) || 10
    let y = await GM.getValue(yKey, null) || 10
    let iconElement = utils.stringToHtml(SLIDERS_SVG)
    document.body.append(iconElement)
    iconElement.style.position = 'absolute'
    iconElement.style.width = "32px"
    iconElement.style.height = "32px"
    iconElement.style.left = `${x}vw`
    iconElement.style.top = `${y}vh`
    iconElement.style.stroke = 'fff'
    iconElement.style.strokeWidth = '16px'

    let clicked = false
    let dragged = false

    iconElement.addEventListener('mousedown', (ev) => {
        clicked = true
        ev.preventDefault() // prevent text from getting selected
    })
    iconElement.addEventListener('mouseleave', (ev) => {
        if (clicked) {
            dragged = true
        }
    })
    window.addEventListener('mouseup', (ev) => {
        if (clicked && !dragged) {
            settings.open()
        }
        clicked = false
        dragged = false
    })
    window.addEventListener('mousemove', (ev) => {
        if (dragged) {
            let xMin = 16 / window.innerWidth * 100
            let yMin = 16 / window.innerHeight * 100
            x = (ev.clientX) / window.innerWidth * 100
            y = (ev.clientY) / window.innerHeight * 100
            GM.setValue(xKey, x)
            GM.setValue(yKey, y)
            if (x < 50) {
                x = Math.max(xMin, x - xMin)
                iconElement.style.left = `${x}vw`
                iconElement.style.right = 'unset'
            } else {
                x = Math.max(xMin, 100 - x - xMin)
                iconElement.style.right = `${x}vw`
                iconElement.style.left = 'unset'
            }

            if (y < 50) {
                y = Math.max(yMin, y - yMin)
                iconElement.style.top = `${y}vh`
                iconElement.style.bottom = 'unset'
            } else {
                y = Math.max(yMin, 100 - y - yMin)
                iconElement.style.bottom = `${y}vh`
                iconElement.style.top = 'unset'
            }
        }
    })
}
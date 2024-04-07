const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const placar = document.querySelector(".placar-valor")
const placarFinal = document.querySelector(".placar-final > span")
const menu = document.querySelector(".tela-menu")
const botaoJogar = document.querySelector(".btn-jogar")

const audio = new Audio('../assets/audio.mp3')

const tamanho = 30

const posicaoInicial = { x:270, y:240 }

let cobra = [posicaoInicial]

const aumentarPlacar = () => {
    placar.innerText = +placar.innerText + 10
}

const numeroAleatorio = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const posicaoAleatoria = () => {
    const numero = numeroAleatorio(0, canvas.width - tamanho)
    return Math.round(numero / 30) * 30
}

const corAleatoria = () => {
    const vermelho = numeroAleatorio(0, 255)
    const verde = numeroAleatorio(0, 255)
    const azul = numeroAleatorio(0, 255)

    return `rgb(${vermelho}, ${verde}, ${azul})`
}

const comida = {
    x: posicaoAleatoria(),
    y: posicaoAleatoria(),
    color: corAleatoria()
}

let direcao, loopId

const desenharComida = () => {

    const { x, y, color} = comida

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(x , y, tamanho, tamanho)
    ctx.shadowBlur = 0
}

function desenharCobra() {
    ctx.fillStyle = "#ddd"

    cobra.forEach((posicao, index) => {

        if (index == cobra.length - 1) {
            ctx.fillStyle = "white"
        }

        ctx.fillRect(posicao.x, posicao.y, tamanho, tamanho)
    })
}

const moverCobra = () => {
    if (!direcao) return

    const cabeca = cobra[cobra.length - 1]

    if (direcao == "direita") {
        cobra.push({ x: cabeca.x + tamanho, y: cabeca.y })
        
    }
    if (direcao == "esquerda") {
        cobra.push({ x: cabeca.x - tamanho, y: cabeca.y })
        
    }
    if (direcao == "cima") {
        cobra.push({ x: cabeca.x, y: cabeca.y - tamanho })
        
    }
    if (direcao == "baixo") {
        cobra.push({ x: cabeca.x, y: cabeca.y + tamanho})
        
    }

    cobra.shift()
}

const desenharGrade = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

const comer = () => {
    const cabeca = cobra[cobra.length - 1]

    if (cabeca.x == comida.x && cabeca.y == comida.y) {
        aumentarPlacar()
        cobra.push(cabeca)
        audio.play()

        let x = posicaoAleatoria()
        let y = posicaoAleatoria()

        while (cobra.find((posicao) => posicao.x == x && posicao.y == y)) {
            x = posicaoAleatoria()
            y = posicaoAleatoria()
        }

        comida.x = x
        comida.y = y
        comida.color = corAleatoria()
    }
}

const checarColisao = () => {
    const cabeca = cobra[cobra.length - 1]
    const canvasLimite = canvas.width - tamanho
    const posicaoPescoço = cobra.length - 2

    const colisaoParde = 
        cabeca.x < 0 || cabeca.x > canvasLimite || cabeca.y < 0 || cabeca.y > canvasLimite
    
    const colisaoPropria = cobra.find((posicao, index) => {
        return index < posicaoPescoço && posicao.x == cabeca.x && posicao.y == cabeca.y
    })
    
    if (colisaoParde || colisaoPropria) {
        gameOver()
    }
}

const gameOver = () => {
    direcao = undefined

    menu.style.display = "flex"
    placarFinal.innerText = placar.innerText
    canvas.style.filter = "blur(4px)"
}

const loopJogo = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    desenharGrade()
    desenharComida()
    moverCobra()
    desenharCobra()
    comer()
    checarColisao()

    loopId = setTimeout(() => {
        loopJogo()
    }, 170)
}

loopJogo()

document.addEventListener("keydown", ({key}) => {
    if (key == "ArrowRight" && direcao != "esquerda") {
        direcao = "direita"
    }
    if (key == "ArrowLeft" && direcao != "direita") {
        direcao = "esquerda"
    }
    if (key == "ArrowUp" && direcao != "baixo") {
        direcao = "cima"
    }
    if (key == "ArrowDown" && direcao != "cima") {
        direcao = "baixo"
    }
})

botaoJogar.addEventListener("click", () => {
    placar.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    cobra = [posicaoInicial]
})
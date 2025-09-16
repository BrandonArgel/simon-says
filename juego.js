const celeste = document.getElementById("celeste");
const violeta = document.getElementById("violeta");
const naranja = document.getElementById("naranja");
const verde = document.getElementById("verde");
const btnEmpezar = document.getElementById("btnEmpezar");
const puntaje = document.getElementById("puntos");
const puntajeActual = document.getElementById("puntos__actuales");
const nivel = document.getElementById("nivel");
const niveles = document.getElementById("niveles");
const ULTIMO_NIVEL = 15;
const body = document.getElementById("body");

class Juego {
  constructor() {
    this.inicializar = this.inicializar.bind(this);
    this.inicializar();
    this.generarSecuencia();
    this.errorSound = new Audio("./assets/audio/error.wav");
    this.sonidos = [
      new Audio("./assets/audio/1.mp3"),
      new Audio("./assets/audio/2.mp3"),
      new Audio("./assets/audio/3.mp3"),
      new Audio("./assets/audio/4.mp3"),
    ];
    setTimeout(this.siguienteNivel, 500);
  }

  inicializar() {
    this.maxScore = localStorage.getItem("puntos");
    if (this.maxScore != null) puntaje.innerHTML = this.maxScore;

    this.siguienteNivel = this.siguienteNivel.bind(this);
    this.elegirColor = this.elegirColor.bind(this);
    btnEmpezar.classList.toggle("hide");
    this.nivel = 1;
    this.puntos = 0;
    this.puntajeActual = 0;
    this.colores = {
      celeste,
      violeta,
      naranja,
      verde,
    };
  }

  generarSecuencia() {
    this.secuencia = Array.from({ length: ULTIMO_NIVEL })
      .fill(0)
      .map((_) => Math.floor(Math.random() * 4));
  }

  siguienteNivel() {
    if (this.nivel >= 12) {
      nivel.style.color = "red";
      niveles.style.color = "red";
    } else if (this.nivel >= 8) {
      nivel.style.color = "yellow";
      niveles.style.color = "yellow";
    } else if (this.nivel >= 4) {
      nivel.style.color = "yellowgreen";
      niveles.style.color = "yellowgreen";
    }

    nivel.innerHTML = this.nivel;
    niveles.innerHTML = 15 - this.nivel;
    this.subnivel = 0;
    this.iluminarSecuencia();
    this.agregarEventosClick();
  }

  transformarNumeroAColor(numero) {
    switch (numero) {
      case 0:
        return "celeste";
      case 1:
        return "violeta";
      case 2:
        return "naranja";
      case 3:
        return "verde";
    }
  }

  transformarColorANumero(color) {
    switch (color) {
      case "celeste":
        return 0;
      case "violeta":
        return 1;
      case "naranja":
        return 2;
      case "verde":
        return 3;
    }
  }

  iluminarSecuencia() {
    for (let i = 0; i < this.nivel; i++) {
      const color = this.transformarNumeroAColor(this.secuencia[i]);
      const nummero = this.transformarColorANumero(color);

      setTimeout(() => {
        this.sonidos[nummero].play();
        this.iluminarColor(color);
      }, 600 * i);
    }
  }

  iluminarColor(color) {
    this.colores[color].classList.add("light");
    setTimeout(() => this.apagarColor(color), 350);
  }

  apagarColor(color) {
    this.colores[color].classList.remove("light");
  }

  agregarEventosClick() {
    this.colores.celeste.addEventListener("click", this.elegirColor);
    this.colores.violeta.addEventListener("click", this.elegirColor);
    this.colores.naranja.addEventListener("click", this.elegirColor);
    this.colores.verde.addEventListener("click", this.elegirColor);
  }

  eliminarEventosClick() {
    this.colores.celeste.removeEventListener("click", this.elegirColor);
    this.colores.violeta.removeEventListener("click", this.elegirColor);
    this.colores.naranja.removeEventListener("click", this.elegirColor);
    this.colores.verde.removeEventListener("click", this.elegirColor);
  }

  elegirColor(ev) {
    const nombreColor = ev.target.dataset.color;
    const numeroColor = this.transformarColorANumero(nombreColor);
    this.sonidos[numeroColor].play();
    this.iluminarColor(nombreColor);

    if (numeroColor === this.secuencia[this.subnivel]) {
      this.subnivel++;
      this.puntos++;
      puntajeActual.innerHTML = this.puntos;

      if (this.subnivel === this.nivel) {
        this.nivel++;
        this.eliminarEventosClick();
        if (this.nivel === ULTIMO_NIVEL + 1) {
          this.ganoElJuego();
        } else {
          setTimeout(this.siguienteNivel, 1500);
        }
      }
    } else {
      this.perdioElJuego();
    }
  }

  ganoElJuego() {
    body.classList.add("ganar");
    localStorage.setItem("puntos", this.puntos);
    puntaje.innerHTML = this.maxScore;
    swal(
      "Simon dice",
      `¡Felicitaciones, Ganaste el Juego! 🥳
       Tienes una excelente memoria 🧠
       Puntos obtenidos:  ${this.puntos}`,
      "success"
    ).then(() => {
      this.inicializar();
    });
  }

  perdioElJuego() {
    if (this.puntos > this.maxScore) {
      localStorage.setItem("puntos", this.puntos);
      swal(
        "Simon Dice",
        `Mejoraste tu puntuacion 😲  
         Nuevo record de ${this.puntos} puntos `,
        "info"
      ).then(() => {
        this.eliminarEventosClick();
        this.inicializar();
      });
    } else {
      swal(
        "Simon Dice",
        `Lo lamentamos, perdiste 😢
         Puntos obtenidos:  ${this.puntos}`,
        "error"
      ).then(() => {
        this.eliminarEventosClick();
        this.inicializar();
      });
    }
  }
}

function empezarJuego() {
  nivel.style.color = "cyan";
  puntajeActual.innerHTML = 0;
  nivel.innerHTML = 0;
  window.juego = new Juego();
}

(function () {
  let maxScore = localStorage.getItem("puntos");

  if (maxScore != null) puntaje.innerHTML = maxScore;
})();

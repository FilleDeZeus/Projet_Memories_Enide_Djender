
class Memorie {
    constructor(tpTotal, cartes) {
        this.tabCartes = cartes;
        this.tpTotal = tpTotal;
        this.resteTps = tpTotal;
        this.timer = document.getElementById('tpsrestant')
        this.ticker = document.getElementById('coups');
    }

    lancement() {
        this.nbClic = 0;
        this.resteTps = this.tpTotal;
        this.cartesVerif = null;
        this.paire = [];
        this.busy = true;
        setTimeout(() => {
            this.melange(this.tabCartes);
            this.decompte = this.decomptePlay();
            this.busy = false;
        }, 500)
        this.dosCartes();
        this.timer.innerText = this.resteTps;
        this.ticker.innerText = this.nbClic;
    }
    decomptePlay() {
        return setInterval(() => {
            this.resteTps--;
            this.timer.innerText = this.resteTps;
            if(this.resteTps === 0)
                this.gameOver();
        }, 1000);
    }
    gameOver() {
        clearInterval(this.decompte);
        document.getElementById('gameOver').classList.add('visible');
    }
    victoire() {
        clearInterval(this.decompte);
        document.getElementById('victoire').classList.add('visible');
    }
    dosCartes() {
        this.tabCartes.forEach(carte => {
            carte.classList.remove('visible');
            carte.classList.remove('matched');
        });
    }
    coups(carte) {
        if(this.nbCoup(carte)) {
            this.nbClic++;
            this.ticker.innerText = this.nbClic;
            carte.classList.add('visible');

            if(this.cartesVerif) {
                this.verifCarteId(carte);
            } else {
                this.cartesVerif = carte;
            }
        }
    }
    verifCarteId(carte) {
        if(this.getCarteType(carte) === this.getCarteType(this.cartesVerif)){
            this.carteId(carte, this.cartesVerif);
            
        }else {
            this.carteMismatch(carte, this.cartesVerif);
       
        }
        
        this.cartesVerif = null;
        carte = null;
    }
    carteId(carte1, carte2) {
        this.paire.push(carte1);
        this.paire.push(carte2);
        // carte1.classList.add('matched');
        // carte2.classList.add('matched');
        // carte1.querySelector("img").remove();
	    // carte2.querySelector("img").remove();
        if(this.paire.length === this.tabCartes.length)
            this.victoire();
    }
    carteMismatch(carte1, carte2) {
        this.busy = true;
        setTimeout(() => {
            carte1.classList.remove('visible');
            carte2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
    melange(tabCartes) {
        for (let i = tabCartes.length - 1; i > 0; i--) {
            const randIndex = Math.floor(Math.random() * (i + 1));
            [tabCartes[i], tabCartes[randIndex]] = [tabCartes[randIndex], tabCartes[i]];
        }
        tabCartes = tabCartes.map((carte, index) => {
            carte.style.order = index;
        });
    }
    getCarteType(carte) {
        return carte.getElementsByClassName('carte-valeur')[0].src;
    }
    nbCoup(carte) {
        return !this.busy && !this.paire.includes(carte) && carte !== this.cartesVerif;
    }
}

if (document.pret == 'loading') {
    document.addEventListener('DOMContentLoaded', pret)
} else {
    pret()
}

function pret() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cartes = Array.from(document.getElementsByClassName('carte'));
    let jeu = new Memorie(100, cartes);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            jeu.lancement();
        });
    });

    cartes.forEach(carte => {
        carte.addEventListener('click', () => {
            jeu.coups(carte);
        });
    });
}


var vida1 = 5;
var puntos = 0;

var HelloWorldLayer = cc.Layer.extend({
    sprFondo:null,
    sprConejo:null,
    zanahorias:[],
    bombas: [],
    size: null,
    etiquetas: [], //tiene las vidas y los puntos
    
    moverConejo: function(location, event){
        cc.log("Mover conejo");
		var  juego = event.getCurrentTarget();
		var ubicacion = location.getLocation();
        var tam = cc.winSize;
        
        var posx;
        var posy;
        
        posx = ubicacion.x;
        if (ubicacion.x < 280){posx=280;}
        if (ubicacion.x > 680){posx=680;}
        
        juego.sprConejo.setPosition(posx,tam.height * 0.15);
        
    },
    
    nadaConejo: function(location, event){
      return true;
    },
    
    random: function getRandomInt(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	},
    
    creaZanahoria: function(){
		
		var zanahoria = new cc.Sprite(res.zanahoria_png);
		zanahoria.setScale(0.4,0.4);
        zanahoria.setPosition(this.random(250,690), this.size.height); 
        this.addChild(zanahoria, 1);
		this.zanahorias.push(zanahoria);
        this.altoZanahoria = 136 
        this.anchoZanahoria = 52
        
	},
    
    moverBombas: function(){
		
        var anchoco = this.anchoConejo;
        var altoco = this.altoConejo;
        var anchobo = this.anchoBomba;
        var altobo = this.altoBomba;
        
        var ColiLocal = function(Conejo,Bomba) {
            
            return (Bomba.x < Conejo.x + anchoco  && 
            Bomba.x + anchobo  > Conejo.x &&
            Bomba.y < Conejo.y + altoco && 
            Bomba.y + altobo > Conejo.y);
        }
        
        var localetiq = this.etiquetas;
        
        var EvaluaVidas = function(){
            
            this.vida1 = this.vida1 - 1;
            if (this.vida1 <=0) {
                alert("Final del Juego. Presione Ok para Continuar jugando");
                this.vida1 = 5;
                this.puntos = 0;
                localetiq[0].setString("Vidas = " + this.vida1);
                localetiq[1].setString("Puntos = " + this.puntos);
                
            }
            else{
                localetiq[0].setString("Vidas = " + this.vida1);
            }
            
        }
        
        var localbombas = this.bombas;
        var localvidas = this.vidas;
        var ConejoLocal = this.sprConejo
        
        var i = 0;
        this.bombas.forEach(function(bombita) {
            bombita.setPosition(bombita.x, bombita.y - 10);  
            var resp = ColiLocal(ConejoLocal,bombita);
              i++;    
              if (resp == true) { 
                  bombita.setVisible(false); 
                  localbombas.splice(i-1,1)
                  i--;
                  
                  EvaluaVidas();
                                   
              }
            
            
        });
        
        return true;
    },
    
    moverZanahorias: function(){
		
        var anchoco = this.anchoConejo;
        var altoco = this.altoConejo;
        var anchoza = this.anchoZanahoria;
        var altoza = this.altoZanahoria;
        
        var ColiLocal = function(Conejo,Zana) {
            
            return (Zana.x < Conejo.x + anchoco  && 
            Zana.x + anchoza  > Conejo.x &&
            Zana.y < Conejo.y + altoco && 
            Zana.y + altoza > Conejo.y);
            
            
        }
        
        var localetiq = this.etiquetas;
        
        var EvaluaPuntos = function(){
            this.puntos = this.puntos + 1;
            localetiq[1].setString("Puntos = " + this.puntos);
            
        }
        
        var localzana = this.zanahorias;
        
        var ConejoLocal = this.sprConejo
        var i = 0;
        this.zanahorias.forEach(function(zana1) {
            zana1.setPosition(zana1.x, zana1.y - 10);  
            var resp = ColiLocal(ConejoLocal,zana1);
              i++;    
              if (resp == true) { 
                  zana1.setVisible(false); 
                  localzana.splice(i-1,1)
                  i--;
                  EvaluaPuntos();
              }
        });
        
        return true;
        
    },

     creaBomba: function(){
		var bomba = new cc.Sprite(res.bomba_png);
		bomba.setScale(0.4,0.4);
        bomba.setPosition(this.random(250,690), this.size.height);
        this.addChild(bomba, 1);
		this.bombas.push(bomba);	 
		this.altoBomba = 10 
        this.anchoBomba = 58
	},
    
    evaluarColisiones: function(Conejo,Bomba) {
    return (Bomba.x < Conejo.x + Conejo.anchoConejo  && 
            Bomba.x + this.anchoBomba  > Conejo.x &&
            Bomba.y < Conejo.y + Conejo.altoConejo && 
            Bomba.y + this.altoBomba > Conejo.y);
    },
    
    ctor:function () {
        this._super();
        //Obteniendo el tamaño de la pantalla
        var size = cc.winSize;
        this.size = size;
        
       
        this.altoConejo = 20
        this.anchoConejo = 65
        
        var labelVidas = new cc.LabelTTF("Vidas = " + vida1, "Arial", 30);
        labelVidas.x = 320 
        labelVidas.y = size.height / 2 + 280 
        this.addChild(labelVidas, 5);
        this.etiquetas.push(labelVidas);
        
        var labelPuntos = new cc.LabelTTF("Puntos = " + puntos, "Arial", 30);
        labelPuntos.x = 620 //size.width / 2;
        labelPuntos.y = size.height / 2 + 280 //size.height / 2 + 200;
        this.addChild(labelPuntos, 5);
        this.etiquetas.push(labelPuntos);
        
        this.schedule(this.creaZanahoria,this.random(1,3));
        this.schedule(this.creaBomba,this.random(1,6));
        
        this.schedule(this.moverBombas,0.05);
        this.schedule(this.moverZanahorias,0.05);
    
        //posicionando la imagen de fondo
        this.sprFondo = new cc.Sprite(res.fondo_png);
        this.sprFondo.setPosition(size.width / 2,size.height / 2);
        this.addChild(this.sprFondo, 0);
        
        //posicionando la imagen de fondo
        this.sprConejo = new cc.Sprite(res.conejo_png);
        this.sprConejo.setPosition(size.width / 2,size.height * 0.15);
        this.addChild(this.sprConejo, 1);
    
        //Inicializando eventos
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.nadaConejo,
            onTouchMoved: this.moverConejo
            //onTouchEnded: this.moverConejo
		}, this);

        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});


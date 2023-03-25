
import { 
  AunConstruct,
  AunElement, 
  AunAppearance, 
  AunState, 
  AunWidget,
  AunView,
  AunStackViews
} from "./foundations";



window.AUNRC = window.AUNRC || {}
  


/**
 * CreateState
 * @description Instance fonctionnelle d'usage de gestion des états Protorian
 * @param state Valeur par default de l'état
 * @example CreateState<StateType>( stateValue )
 */
export function CreateState<S extends IState>( state : S ){

  return new AunState<S>( state );
  
}


/**
 * DropComponent
 * @param target Balise HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur
 * @param component Composant à deposer
 * @description Lier un composant à une cicle 
 * @example DropComponent<PropsType>( '#root', Component( { ... } ) )
 * DropComponent<PropsType>( document.getElementById('root'), Component( { ... } ) )
 */
export function DropComponent<P extends IWProps, E extends INode>( 
  
  component : IWidget<P, E>,
  
  target : INode,
  
){

  target.append( component.element.instance )

  return component
  
}


/**
 * DropComponents
 * @description Lier plusieurs composants à plusieurs cicles.
 * @param targets Balises HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur. Instancie plusieurs cicle à la fois.
 * @param component Composant à deposer dans l'élément HTML
 * @example DropComponents<PropsType, HTMLDivElement>( '.drop-target', ( props : Props ) => ... )
 */
export function DropComponents<P extends IWProps, E extends INode>( 
  
  component : IWidget<P, E>,
  
  targets : NodeListOf<INode>,
  
){

  targets.forEach( target => DropComponent( component, target ) )

  return component;

}


/**
 * InstantiateComponent
 * @description Instancier un composant. Cela permet de garder l'instance courante du composant avec les propriétés définies. À utiliser dans les cas l'IDE n'arrive pas typer correctement les variables.
 * @param component Composant cible
 * @example InstantiateComponent( component( props ) )
 */
export function InstantiateComponent( component : IWidget<any, any> ){ return component; }


/**
 * AsyncComponent
 * @description Utiliser un composant avec une promesse. Composant bloquant en attendant le traitement. Il peut être ajouter aux enfants d'un widget
 * @param callback Fonction de renvoie pour le traitement d'un promesse. Puis renvoyer un composant instancié 
 * @example AsyncComponent( ( resolve, reject ) => {
 *    setTimeout( () => resolve( component() ), 3000 )
 * })
 */
export async function AsyncComponent<P extends IWProps, E extends INode>( callback : IWidgetAsyncCallback ) : Promise<IWidget<P,E>>{

  return (new Promise<IWidget<any, any>>( callback ))
  
}


/**
 * UseComponent
 * @description Utiliser un composant dans une / plusieurs cibles
 * @param target Balises HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur. Instancie plusieurs cicle à la fois.
 * @param component Composant instancié
 * @example UseComponent<PropsType>( '#root', component( props ) ) // Requête de selecteur pour la cible
 * UseComponent<PropsType>( document.getElementById('root'), component( props ) ) // Instance de type HTMLElement pour la cible
 */
export function UseComponent<P extends IWProps, E extends INode>( 
  
  component : IWidget<any, any>,
  
  target : IWTarget,
  
){

  if( typeof target == 'string' ){

    DropComponents<P, E>( component, document.querySelectorAll( target ) )
    
  }

  else if( target instanceof NodeList ){

    DropComponents<P, E>( component, target )
    
  }

  else if ( target instanceof HTMLElement ){

    DropComponent<P, E>( component, target )

  }

  else if( target instanceof AunElement ){

    DropComponent<P, E>( component, target.instance )
 
  }

  return component as IWidget<P, E>;
  
}


/**
 * CreateKit
 * @description Créer un Kit Composant
 * @param definition Définition du Kit
 * @example
 * CreateKit( {
 *    appearance: { ... }
 *    component: ( props : Props ) => ...
 * } )
 */
export function CreateKit( definition : IKitProps ){
  
  const appearence = new AunAppearance()

  appearence.sheet( definition.appearance ).mount();

  return <P extends IWProps, E extends INode>( p : P ) => 

    (definition.component<P, E>( p ) as IWidget<P,E>)
    
      .layer( element => element.className( appearence.uid ) )
    
  ;
  
}


/**
 * aun — Protorian Virtual Element
 * @description Instance fonctionnelle d'usage des éléments Protorian
 * @param tagname Nom de la balise HTML
 * @example aun<HTMLSpanElement>( 'span' )
 */
export function aune<E extends INode>( tagname : string ){

  return (new AunElement<E>( tagname ))
  
}


/**
 * VWidget
 * @description Instance fonctionnelle d'usage des Widgets Protorian
 * @param tagname Nom de la balise HTML
 * @param props Propriétés du widget
 * @example VWidget<PropsType, HTMLSpanElement>( 'span', props )
 */
export function VWidget<P extends IWProps, E extends INode>( tagname : string, props : P ){

  const widget = (new AunWidget<P, E>( tagname, props ))
  
  widget.emitter.dispatch( 'beforeRendering', widget );

  widget.render();

  widget.emitter.dispatch( 'afterRendering', widget );

  return widget;

}


/**
 * Widget
 * @description Créer une couche de calque
 * @param props Propriétés du widget. La propriété `children` représente les enfants du widget (contenu)
 * @example Widget<PropsType>({
 * children: ...
 * otherProp: ...
 * })
 */
export function Widget<P extends IWProps>( props : P ){

  return VWidget<P, HTMLDivElement>( 'div', props )
  
}


/**
 * Textual
 * @description Calque destiné aux textes
 * @param props Propriétés du widget. La propriété `children` représente les enfants du widget (contenu)
 * @example Textual<PropsType>({
 * children: ...
 * otherProp: ...
 * })
 */
export function TextWidget<P extends IWProps>( props : P ){

  return VWidget<P, HTMLSpanElement>( 'span', props )
  
}



export function View<C extends IWProps>( component : IComponentConstructor, options ?: IViewOptions<C> | undefined  ){

  return new AunView<C>( component, options )
  
}

export function CreateStackViews<Scheme>( 
  
  views : IStackViewsList<Scheme>, 
  
  options : IStackViewsOptions<Scheme> = {}
  
){

  return new AunStackViews<Scheme>( views, options )
  
}


// export function ModalWidget(){}


// export function SheetWidget(){}


// export function ActionSheetWidget(){}


// export function ListSheetWidget(){}


// export function DroplistWidget(){}


// export function ButtonWidget(){}


// export function ImageWidget(){}


// export function ScrollWidget(){}


// export function FormWidget(){}


// export function InputWidget(){}




/**
 * Protorian Construct
 * @description Construire un composant à partir des enfants
 * @param component Composant cible
 * @param children Enfant à injecter
 * @example Construct<ComponentType>( component, children )
 * Construct( component, children )
 */
export function Construct<Component extends IWidget<IWProps, INode>>( 
  
  component : Component, 
  
  children : IChildren 
  
){ return ( new AunConstruct() ).make( component, children ) }



/**
 * CreateComponent
 * @description Créer un composant en ajoutant immédiatement à la fil d'attente hydratation tout en permetant de l'exporter avec un nom d'emprunt. 
 * @param name 
 * @param widgetConstructor 
 * @example export const HelloWord = CreateComponent<PropType>('HelloWorld', ( props : IWProps ) => ... )
 */
export function CreateComponent<P extends IWProps>( 
  
  name : string, 
  
  widgetConstructor : IHydrateComponent<any, HTMLElement> 
  
) : IHydrateComponent<P, HTMLElement> {

  if( !( window.AUNHW instanceof MutationObserver ) ){

    ActiveAutoHydrateComponents()

  }
  
  HydrateComponentQueue<P>( name, widgetConstructor )

  return widgetConstructor
  
}



/**
 * HydrateComponentQueue
 * @description Fil d'attente des hydration des composants Protorian
 * @param name CNom du composant. Sensible à la case
 * @param widgetConstructor Constructeur du composant Protorian
 * @example HydrateComponentQueue<WidgetPropsType>( 'ComponentName', ( props : WidgetProps ) => ... )
 */
export function HydrateComponentQueue<P extends IWProps>( 
  
  name : string, 
  
  widgetConstructor : IHydrateComponent<any, HTMLElement> 
  
){

  window.AUNRC[ (name).toUpperCase() ] = widgetConstructor

  HydrateComponent<P>( name, widgetConstructor )

  return widgetConstructor;
  
}


/**
 * HydrateComponent
 * @param name Chaine de caratère représentant le nom du composant. Sensible à la case
 * @param widgetConstructor Constructeur du composant Protorian
 * @example HydrateComponent<PropsType>( 'Hello', HelloComponent )
 */
export function HydrateComponent<P extends IWProps>( 
  
  name : string, 
  
  widgetConstructor : IHydrateComponent<any, HTMLElement> 
  
){

  const refs = document.querySelectorAll<Element>(`${ name }`)

  /**
   * Références liste
   */
  refs.forEach( ref => {

    /**
     * Extraction des props
     */
    const props = ExtractProps<P>( ref.attributes )

    props.children = ref.innerHTML || undefined;
    
    /**
     * Mise en place du composant
     */
    const widget = widgetConstructor( props )

    /**
     * Remplacement
     */
    ref.parentNode?.replaceChild( widget.element.instance, ref )
    
  })

  
  return widgetConstructor;

}

/**
 * ExtractProps
 * @description Extraction des propriétés dans le constructeur d'un composant
 * @param attributes Contenu de la propriété "HTMLElement.attributes"
 * @example ExtractProps<PropsType>( element.attributes )
 */
export function ExtractProps<P extends IWProps>( attributes : NamedNodeMap ) : P{

  const props : P = {} as P

  Object.values( attributes ).forEach( attribute => {
    
      props[ attribute.name as keyof P ] = attribute.value as P[ keyof P ]
      
  })
  
  return props;
  
}



/**
 * ActiveAutoHydrateComponents
 * @description Active l'hydratation automatique des composants
 * @example ActiveAutoHydrateComponents()
 */
export function ActiveAutoHydrateComponents(){

  window.AUNHW = window.AUNHW || new MutationObserver( mutations => {

    const storeKeys = Object.keys( window.AUNRC )

    mutations.forEach( mutation => {
      
      if( 
        
        mutation.type == 'childList' && 
        
        mutation.target instanceof HTMLElement

      ){

        mutation.addedNodes.forEach( target => {

          if( target instanceof HTMLElement && storeKeys.includes( target.tagName.toUpperCase() ) ){

            HydrateComponent( target.tagName, window.AUNRC[ target.tagName ] )

          }
          
        })

      }
      
    })
    
  })

  window.AUNHW.observe( document.body, {
    
    subtree: true,

    childList: true,

  })

  return window.AUNHW;
  
}




/**
 * Protorian
 * @description Exportations des fonctionnalités de base du framework 
 */
export default class Protorian { 

  /**
   * aun — Protorian Virtual Element
   * @description Instance fonctionnelle d'usage des éléments Protorian
   */
  static VirtualElement = aune;

  /**
   * VWidget
   * @description Instance fonctionnelle d'usage des Widgets Protorian
   */
  static VWidget = VWidget;

  /**
   * Construct
   * @description Construire un composant via AunConstruct
   */
  static Construct = Construct;

  /**
   * Widget
   * @description Créer une couche de calque
   */
  static Widget = Widget;

  /**
   * Textual
   * @description Calque destiné aux textes
   */
  static Textual = TextWidget;
  
  /**
   * CreateState
   * @description Instance fonctionnelle d'usage de gestion des états Protorian
   */
  static CreateState = CreateState;

  /**
   * DropComponent
   * @description Lier un composant à une cicle 
   */
  static DropComponent = DropComponent;

  /**
   * DropComponents
   * @description Lier plusieurs composants à plusieurs cicles 
   */
  static DropComponents = DropComponents;

  /**
   * InstantiateComponent
   * @description Instancier un composant. Cela permet de garder l'instance courante du composant avec les propriétés définies
   */
  static InstantiateComponent = InstantiateComponent;

  /**
   * AsyncComponent
   * @description Utiliser un composant avec une promesse. Composant bloquant en attendant le traitement. 
   */
  static AsyncComponent = AsyncComponent;

  /**
   * UseComponent
   * @description Utiliser un composant dans une / plusieurs cibles
   */
  static UseComponent = UseComponent;
  

}



declare interface Node{

  AUNAOD?: boolean;
  
}

declare interface Window{

  /**
   * Stockage des composant crée
   */
  AUNRC : IRegistryComponentConstructorStack

  /**
   * Stockage des Observateurs de mutation pour l'hydratation des composants
   */
  AUNHW : MutationObserver

}

declare type IChild = string 
  | number 
  | boolean 
  | IStateManager<IState> 
  | IWidget<any, any> 
  | HTMLElement 
  | undefined;

declare type IChildren = IChild 
  | Promise<IWidget<any, any>> 
  | Array<IChild 
  | Promise<IWidget<any, any>>> 
  | IChildren[];

declare type INode = HTMLElement;

declare type INodeLayer = HTMLDivElement;

declare type INodeText = HTMLSpanElement;


declare type IWTarget = string | INode | NodeListOf<INode> | IElement<INode>;

declare type IWTargetNode = INode | NodeListOf<INode> | IElement<INode>;


declare type IFindElementCallback = ( element : HTMLElement ) => void


declare interface IRegistryComponentConstructorStack {

  [ K: string ] : ( props: any ) => IWidget<any, any> 

}

declare type IObjectToString = {

  eq ?: string | undefined;

  start ?: string | undefined;

  end ?: string | undefined;

  joiner ?: string | undefined;
  
}

/**
 * IProps
 * @description définition des propriétés de base
 */
declare interface IProps {

  [ P : string ] : any;

}


/**
 * IWProps extends IProps
 * @description Les propriétés d'un widget. Les propriétés iront en attributs html avec le prefix "prop:{KEY}" pour garder la persistence. Les données de type objet seront convetir en JSON
 */
declare interface IWProps extends IProps{

  children ?: IChildren;

}



declare type IEmitterCallback<I> = ( payload : I ) => void | boolean;


declare type IEmitterEntry = {

  force ?: boolean;

  callback : IEmitterCallback<any>
  
}

declare type IEmitterEntries<Scheme extends IEmitterScheme> = {

  [ K in keyof Scheme ] : IEmitterEntry[]
  
}


declare type IEmitterProgations<Scheme extends IEmitterScheme> = {

  [ K in keyof Scheme ] : boolean
  
}


declare interface IEmitterScheme{

  [ K : string ] : any
  
}



declare interface IPhysicalMethods{

  asyncMeasure() : DOMRect;

  measure( callback : IElementMeasureCallback ) : this;

  clean() : this;

  remove() : this;

  asyncOffset() : IElementOffset;

  offset( callback : IElementOffsetCallback ) : this;

  content( children ?: IChildren | undefined ) : this | IChildren;

  html( data ?: string | undefined ) : this | string;

  append( ...nodes: (string | Node)[] ) : this;


  listen<L extends keyof IElementEmitterScheme>( 
    
    type : L, 
    
    callback : IEmitterCallback<IElementEmitterScheme[L]>
    
  ) : this;

  on<T extends keyof HTMLElementEventMap>( 
    
    type : T, 
    
    callback : IElementEventCallback<T>,

    options?: AddEventListenerOptions | boolean | undefined
    
  ) : this;


  style( tokens : IElementCSS | undefined ) : this;

  removeStyle( tokens : IElementCSSRemoves ) : this;

  
  toggle( tokens : IElementClassName ) : this;

  className( tokens : IElementClassName | undefined ) : this | string[];

  removeClassName( tokens : IElementClassName ) : this;

  // replaceClassName( older : IElementClassName, newer : IElementClassName ) : this;


  attribute( 
    tokens ?: IAttributesMap | undefined, 
    ns?: string | undefined, 
    separator?: string | undefined 
  ) : this;

  removeAttribute( 
    tokens : IAttributesMap,
    ns?: string | undefined, 
    separator?: string | undefined 
  ) : this;

  toggleAttribute( 
    tokens : IAttributesMap,
    ns?: string | undefined, 
    separator?: string | undefined 
  ) : this;
  
}


declare interface IEmitter<Scheme extends IEmitterScheme>{

  propagations : IEmitterProgations<Scheme>;

  entries : IEmitterEntries<Scheme>;

  listen<I extends keyof Scheme>( type : I, callback : IEmitterCallback<Scheme[ I ]>, force ?: boolean ) : this;

  dispatch( type : keyof Scheme, data ?: any ) : this;
  
}



declare type IElementCSS = Partial<CSSStyleDeclaration>;

declare type IElementCSSRemoves = keyof IElementCSS | Array<keyof IElementCSS>; 

declare type IElementListenerCallback = () => void

declare type IElementEventCallback<T extends keyof HTMLElementEventMap> = ( args : HTMLElementEventMap[T] ) => void

declare type IElementClassName = string[] | string;

// declare interface IElementClassName{

//   [ C : string ] : string | IElementClassName | undefined;
  
// }

// declare interface IAttribute{

//   [ A : string ] : string | IAttribute | undefined
  
// }


// declare interface IAttributesProps extends IAttributesMap{

//   [ A : string ] : IAttributesProps | string  | number | boolean | null
  
// }



declare interface IElementEmitterScheme {

  own : IWidget<any, any>;

  measure : DOMRect;

  clean : undefined;

  remove : undefined;

  offset : IElementOffset;

  content : IChildren | IChildren[];

  html : string;

  on : {

    type: keyof HTMLElementEventMap;
    
    callback: IElementEventCallback<any>;
    
    options : AddEventListenerOptions | boolean | undefined
    
  }

  style : IElementCSS;

  removeStyle : IElementCSSRemoves;

  toggle : IElementClassName

  append : (string | Node)[]

  className : IElementClassName;

  removeClassName : IElementClassName;

  // replaceClassName : {

  //   older : IElementClassName;

  //   newer : IElementClassName;
    
  // };
  
}

declare type IElementMeasureCallback = ( offset : DOMRect ) => void

declare type IElementOffsetCallback = ( offset : IElementOffset ) => void

declare type IElementOffset = {

  height : number

  width : number

  top : number

  left : number

  parent : Element | null
  
}

declare interface IElement<E extends INode> extends IPhysicalMethods {

  instance : E;

  emitter : IEmitter<IElementEmitterScheme>;

  get widget() : IWidget<any, E> | undefined;

  own<P extends IWProps>( widget : IWidget<P, E> | undefined ) : this;
  
}





declare type IWidgetTimerCallback = <

  P extends IWProps, 

  E extends INode

  >( widget : IWidget<P, E>, timer : NodeJS.Timeout ) => void

declare type IWidgetRequestAnimationFrameCallback = <

  P extends IWProps, 

  E extends INode

  >( widget : IWidget<P, E> ) => void


declare type IWidgetAsyncCallback = ( 

  resolve: (value: IWidget<any, any> | PromiseLike<IWidget<any, any>>) => void, 
  
  reject: (reason?: any) => void 

) => void


declare type IWidgetLayerCallback<E extends INode> = ( element : IElement<E> ) => void

declare type IWidgetReadyCallback<P extends IWProps,E extends INode> = ( widget : IWidget<P, E> ) => void


declare interface IWidgetEmitterScheme<P extends IWProps, E extends INode> {

  ready : IWidget<P, E>;

  beforeRendering : IChildren;

  afterRendering : IChildren;
  
  property : P[ keyof P ];

  excavation : IWidget<P, E>;

  remove : undefined;

  childAdded : IChildren;

  elementAdded : Element;

  widgetAdded : IWidget<any, any>;

  promiseAdded : Promise<IWidget<any, any>>;

  htmlAdded : string | boolean | number;

  stateAdded : IStateManager<any>;

}

declare interface IWidget<P extends IWProps, E extends INode>{

  element : IElement<E>;

  children ?: IChildren | IChildren[] | undefined;

  get props() : P;
  
  emitter : IEmitter<IWidgetEmitterScheme<P, E>>;
  
  construct : IConstruct<P, E>;

  ready( callback : IWidgetReadyCallback<P, E> ) : this;

  layer( callback : IWidgetLayerCallback<E> ) : this;

  appear( payload : IAppearanceObject ) : this;

  content( children ?: IChildren | undefined ) : this | IChildren;

  // append( ...children : IChildren[] ) : this;

  refresh( props ?: Partial<P> | undefined ) : this;
  
  render() : this;

  remove() : this;


  timeOut( callback : IWidgetTimerCallback, time ?: number ) : this;

  timeInterval( callback : IWidgetTimerCallback, time ?: number ) : this;

  frameReady( callback : IWidgetRequestAnimationFrameCallback ) : this;
  
  // catch<P extends IWProps, E extends INode>( callback : IStateErrorExceptionCallback<P, E> ) : IWidget<P, E>;
  
}



/**
 * IState
 * @description
 */
declare interface IStateObject{
  
  [ K: string ] : IState

}

declare type IState = IStateObject | boolean | string | number | null | undefined


declare type IStateRecords<S extends IState> = {

  anchor: Text | undefined;

  widget: IWidget<any, any> | undefined;

  callback: IStateCallback<S>;
  
}


declare type IStateCallback<S extends IState> = ( state : S ) => IWidget<any, any>;


declare type IStateErrorCallbackAunyload<M> = {

  manager : M;

  error: any;
  
}

declare type IStateErrorCallback<S extends IState> = ( 
  
  payload : IStateErrorCallbackAunyload<IStateManager<S>> 
  
) => void;



declare interface IStateManagerEmitterScheme<S extends IState> {

  success : IStateManager<S>;

  error : unknown;

  init : S

  change: S
  
}


declare interface IStateManager<S extends IState>{

  emitter : IEmitter<IStateManagerEmitterScheme<S>>

  get value() : S;
  
  records( widget : IWidget<any, any> ) : this;

  record( widget : IWidget<any, any>, record : IStateRecords<any> ) : IStateRecords<any>;

  sync() : this;

  set( value : S | Partial<S> ) : this;
  
  use( 
    
    callback : IStateCallback<S> 
    
  ) : this;
  
}



declare interface IWidgerErrorException{

  messageToString( data : string ) : string;

}






declare interface IConstructEmitterScheme<P extends IWProps, E extends INode> {

  before : IWidget<P, E>;

  after : IWidget<P, E>;
  
  appearance: IAppearance;

}

declare interface IConstruct<P extends IWProps, E extends INode>{

  emitter : IEmitter<IConstructEmitterScheme<P, E>>;

  appearance : IAppearance;

  make( root : IWidget<P, E>, children : IChildren | IChildren[] ) : IWidget<P, E>;

  makeChildren( root : IWidget<P, E>, children : IChildren ): IWidget<P, E>;

  makeAppearance( root : IWidget<P, E>, payload : IAppearanceObject ): IWidget<P, E>;
  
}






declare interface IAppearanceEmitterScheme {

  ready: IAppearance;

  insertProperties: IAppearanceObject;

  removeProperties: IAppearanceObjectDestroyed;
  
  set: IAppearanceObject;

  unset: IAppearanceObjectDestroyed;
  
  mount: IAppearance;

  sync: IAppearance;

  destroy: undefined;
  
}

declare type IAppearanceValues = string | number | undefined

declare interface IAppearanceCSSDeclaration extends Partial<CSSStyleDeclaration>{

  paddingVertical ?: IAppearanceValues;
  
  paddingHorizontal ?: IAppearanceValues;
  
  marginVertical ?: IAppearanceValues;
  
  marginHorizontal ?: IAppearanceValues;
  
}

declare type IAppearanceObject = {

  [ K in keyof Partial<IAppearanceCSSDeclaration> ] : IAppearanceValues;

}

declare interface IAppearanceStyleSheet{

  [ Selector : string ] : IAppearanceObject;

}

declare type IAppearanceObjectDestroyed =  Array<keyof IAppearanceObject>

declare interface IAppearance{

  instance: HTMLStyleElement;

  uid : string;

  properties: IAppearanceObject; 

  emitter: IEmitter<IAppearanceEmitterScheme>;

  insertProperties( 
    
    properties : IAppearanceObject, 
    
    data : IAppearanceObject 
    
  ) : IAppearanceObject;

  removeProperties( 
    
    properties : IAppearanceObject, 
    
    payload : IAppearanceObjectDestroyed 
    
  ) : IAppearanceObject

  sheet( stylesheet : IAppearanceStyleSheet ) : this;

  set( payload : IAppearanceObject ) : this;

  unset( payload : IAppearanceObjectDestroyed ) : this;

  mount() : this;

  mountImmediat() : this;

  sync() : this;

  destroy() : this;
  
}




declare type IHydrateComponent<
  
  P extends IWProps, 
  
  E extends HTMLElement
  
> = ( ( props: P ) => IWidget<P, E> )

declare type IComponentConstructor = ( <
  
  P extends IWProps, 

  E extends HTMLElement

>( props: any ) => IWidget<any, any> )





declare type IAttributesMapValues = IAttributesMap | Array<any> | string  | number | boolean | null | (() => void)

declare type IAttributesMap = {

  [ A : string ] : IAttributesMapValues
  
}

declare type IAttributesAunrsed = {

    [ A : string ] : string;
    
}

declare type IAttributesToggleMap = {

    [ A : string ] : boolean;
    
}

declare type IAttributeSyncAunyload = {
  
  entries: string[];

}

declare type IAttributeAddAunyload = {
  
  added: string;

}

declare type IAttributeRemoveAunyload = {
  
  removed: string;

}

declare type IAttributeReplaceAunyload = {
  
  older: string;

  newer: string;

}

declare type IAttributeUnlinkAunyload = {
  
  value: string[] | string;

}

declare type IAttributesEmitterScheme = {

  sync: IAttributeSyncAunyload;

  add: IAttributeAddAunyload;

  remove: IAttributeRemoveAunyload;

  replace: IAttributeReplaceAunyload;

  link: IAttribute;
  
  unlink: IAttributeUnlinkAunyload;

  unlinks: IAttribute;

}

declare interface IAttribute{

  attributeName : string;
  
  get entries() : string[];

  get value() : string;

  sync( attribute ?: string ) : this;

  add( value : string ) : this;

  remove( value : string ) : this;

  replace( older : string, value : string ) : this;

  contains( value : string ) : boolean;
  
  link() : this;

  unlink( property ?: string | string[] ) : this;
  
}




// declare interface IKitEmitterScheme{

// }

declare interface IKitProps{

  appearance: IAppearanceStyleSheet;

  component: IComponentConstructor;

}

// declare interface IKit<P extends IWProps, E extends INode>{

//   emitter : IEmitter<IKitEmitterScheme>;
  
//   props : IKitProps<P, E> | undefined

//   render(): this;
  
// }





declare type IViewEmitterCallbackArgument<C extends IWProps> = {

  component: IWidget<C, HTMLDivElement>;

  router: IView<C>
  
}

declare type IViewEmitterCallback<C extends IWProps> = (

  payload : IViewEmitterCallbackArgument<C>
  
) => void


declare interface IViewEmitters<C extends IWProps> {

  show?: IViewEmitterCallback<C>;

  hide?: IViewEmitterCallback<C>;
  
}


declare interface IViewOptions<C extends IWProps>{

  name: string;
  
  title: string;

  presenter: 'normal' | 'modal' | 'overlay' | 'overlaySideLeft' | 'overlaySideRight';

  emitters: IViewEmitters<C>

}


declare interface IView<ComponentProps extends IWProps>{
  
  get parameters() : ComponentProps;
  
  get component() : IWidget<ComponentProps, HTMLDivElement> | undefined

  options : IViewOptions<ComponentProps>;
  
  componentConstructor : IComponentConstructor;

  show( parameters : ComponentProps ) : this;

  hide() : this;

  refresh( parameters ?: Partial<ComponentProps> | undefined ) : this;
  
  render() : IWidget<ComponentProps, HTMLDivElement>;
  
}




declare type IStackViewsOptions<Scheme> = Omit<Partial<INavigationOptions<Scheme>>, 'middlewares'> & {

  index ?: keyof Scheme;

  canvas ?: IWTarget
  
  errorView ?: keyof Scheme;

}

declare type IStackViewsList<Scheme> = {

  [ K in keyof Scheme ] : IView<any>
  
}

declare interface IStackViewsEmitterScheme<Scheme>{

  error: keyof Scheme;
  
}

declare interface IStackViews<Scheme>{

  get views(): IStackViewsList<Scheme>;

  emitter : IEmitter<IStackViewsEmitterScheme<Scheme>>

  options : IStackViewsOptions<Scheme>;
  
  navigation: INavigation<Scheme>;

  middleware( payload : INavigationMiddlewareProps<Scheme> ) : this;
  
  run(): this;
  
}





declare type INavigationNavigateParser = 'hashtag' | 'directory'

declare type INavigationNavigateProps<Scheme> = {

  navigation: INavigation<Scheme>;

  routeName: keyof Scheme;
  
  parser: INavigationNavigateParser;

}

declare type INavigationMiddlewareProps<Scheme> = {

  navigation: INavigation<Scheme>;

  event: Event | undefined;

  parser: INavigationNavigateParser;

  routeName: keyof Scheme;

  args: Scheme[ keyof Scheme ] | IWProps | undefined;
  
}

declare type INavigationMiddlewareCallback<Scheme> = ( 
  
  payload : INavigationMiddlewareProps<Scheme> 
  
) => void;


declare type INavigationOptions<Scheme> = {

  useHashtagParser?: boolean;

  capture ?: boolean;

  middlewares?: INavigationMiddlewareCallback<Scheme>[]
  
}


declare interface INavigationEmitterScheme<Scheme>{

  options: INavigation<Scheme>;

  navigate: INavigationNavigateProps<Scheme>;

} 


declare interface INavigation<Scheme>{

  emitter: IEmitter<INavigationEmitterScheme<Scheme>>

  setOptions( options: INavigationOptions<Scheme> ) : this;

  middleware( middleware : INavigationMiddlewareCallback<Scheme> ) : this;

  dispatchNavigate( ev ?: PopStateEvent | undefined ) : this;

  capturesActions() : this;

  isExternalURL( url : string ) : boolean;

  parseElementCaptured( event : Event ) : HTMLElement | undefined;

  currentRoute() : keyof Scheme;

  currentQuery<T>() : T | undefined;

  observe() : this;

  navigate( 
    
    route : keyof Scheme, 
    
    props ?: Scheme[ keyof Scheme ], 
    
    ev?: PopStateEvent 
    
  ) : this;
  
}

declare module 'protorian-aun/example.main' {
  export {};

}
declare module 'protorian-aun/exceptions' {
  export class WidgetErrorException extends Error implements IWidgerErrorException {
      message: string;
      constructor(message: string);
      messageToString(data: string): string;
  }

}
declare module 'protorian-aun/foundations' {
  /**
   * fe — Find Element
   * @param find Recherché
   * @param callback Fonction de rappel contenant l'element html en argument
   */
  export function fe(find: IWTarget | undefined, callback?: IFindElementCallback): IWTargetNode | undefined;
  /**
   * Protorian EventDispatcher — Emetteur d'émission
   * @description Gestionnaire d'évènements
   * @example new AunEmitter<EmitScheme>()
   */
  export default class AunEmitter<Scheme extends IEmitterScheme> implements IEmitter<Scheme> {
      /**
       * Gestion de la propagation
       */
      propagations: IEmitterProgations<Scheme>;
      /**
       * Stockage des émissions
       */
      entries: IEmitterEntries<Scheme>;
      /**
       * Ecouter une émission de l'émetteur
       * @description Ecouteur d'évèvements par rapport à un "SLUG". Utiliser un retour "TRUE" pour stopper la propagation de l'instance déclenchée
       * @param type Type d'émission déclaré dans le `Scheme` de l'instanciation
       * @param callback Fonction de rappel content en `argument[0]` les données définit par le dispatcher
       * @example emitter.listen<ReturnType>( 'emitterNameInKeyOfScheme', ( data : ReturnType ) => ... )
       */
      listen<I extends keyof Scheme>(type: I, callback: IEmitterCallback<Scheme[I]>, force?: boolean | undefined): this;
      /**
       * Déclencheur un type d'émission de l'émetteur
       * @description Déclencheur les écouteurs par rapport au `type`
       * @param type Type d'émission déclaré dans le `Scheme` de l'instanciation
       * @param data Donnée à renvoyer aux écouteurs d'émission de l'émeteur
       * @example emitter.dispatch( 'emitterNameInKeyOfScheme', ... )
       *
       */
      dispatch(type: keyof Scheme, data: Scheme[keyof Scheme]): this;
  }
  /**
   * Protorian Element
   * @description Encapscule l'lement HTML pour un usage optimal
   * @example AunElement<HTMLDivElement>('div')
   */
  export class AunElement<E extends INode> implements IElement<E> {
      #private;
      /**
       * Instance contenant le DOM
       */
      instance: E;
      /**
       * Emetteur
       */
      emitter: AunEmitter<IElementEmitterScheme>;
      /**
       * Widget associé
       */
      get widget(): IWidget<any, E> | undefined;
      constructor(tagname: string);
      /**
       * own
       * @description Définit le widget propriétaire de l'élément
       * @param widget Widget Cible
       * @example element.own( widget )
       */
      own<P extends IWProps>(widget: IWidget<P, E>): this;
      /**
       * asyncMeasure
       * @description Retrouve les dimension et le position de l'instance de l'élément en retournant les valeurs.
       * Ceci permet d'enchaine avec une autre methode
       * @example element.asyncMeasure()
       */
      asyncMeasure(): DOMRect;
      /**
       * measure
       * @description Execute asyncMeasure mais avec un callback
       * @param callback Fonction de rappel retournant la valeur en argument
       * @example element.measure( measure => ... )
       */
      measure(callback: IElementMeasureCallback): this;
      /**
       * clean
       * @description Nettoie le contenu de l'instance de l'élément
       * @example element.clean()
       */
      clean(): this;
      /**
       * remove
       * @description Supprime l'élément
       * @example element.remove()
       */
      remove(): this;
      /**
       * asyncOffset
       * @description Retrouve les valeurs de l'`offset` de l'intance de l'élément en les retournant
       * @example element.asyncOffset()
       */
      asyncOffset(): {
          height: number;
          width: number;
          top: number;
          left: number;
          parent: Element | null;
      };
      /**
       * offset
       * @description Exécute `asyncOffset` mais avec une fonction de rappel.
       * Ceci permet d'enchaine avec une autre methode
       * @param callback Fonction de rappel retournant la valeur en argument
       * @example element.offset( offset => ... )
       */
      offset(callback: IElementOffsetCallback): this;
      /**
       * content
       * @description Ajoute un contenu à l'élément. Ou Retourne les enfants du widget propriétaire.
       * @param children Enfant à ajouter
       * @example
       * element.content( undefined ) // Retourne les enfants du widget propriétaire
       * element.content( 'string' )
       * element.content( widget )
       * element.content( [ widget1, widget2, ... ] )
       */
      content(children?: IChildren | IChildren[] | undefined): string | number | boolean | HTMLElement | this | IStateManager<IState> | IWidget<any, any> | Promise<IWidget<any, any>> | IChildren[] | undefined;
      /**
       * html
       * @description Définit un contenu HTML dans l'élément
       * @param data Contenu HTML
       * @example
       * element.html( 'string' )
       */
      html(data?: string | undefined): string | this;
      /**
       * append
       * @description Ajout un noeud ou une chaine de caratère à l'élément
       * @param nodes Noeud ou chaine de caratère
       * @example
       * element.append( 'string' )
       * element.append( document.querySelector('.box') )
       */
      append(...nodes: (string | Node)[]): this;
      /**
       * listen
       * @description Écoute l'emetteur gréffé à l'élément
       * @param type Type d'émission
       * @param callback Fonction de rappel retournant la valeur associé au `type`
       * @example
       * element.listen( 'EMITTER_TYPE', data => ... )
       * element.listen<IElementEmitterScheme>( 'EMITTER_TYPE', data => ... )
       */
      listen<L extends keyof IElementEmitterScheme>(type: L, callback: IEmitterCallback<IElementEmitterScheme[L]>): this;
      /**
       * on
       * @description Écoute les évènement gréffé à l'instance de l'élément
       * @param type
       * @param callback
       * @param options
       * @example
       * element.on<PointerEvent>( 'LISTENER_TYPE', ev => ... )
       */
      on<T extends keyof HTMLElementEventMap>(type: T, callback: IElementEventCallback<T>, options?: AddEventListenerOptions | boolean | undefined): this;
      /**
       * style
       * @description Définit le style de l'instance lié à l'élément
       * @param properties Propriétés et valeurs à définir
       * @example
       * element.style( {
       *    'property': 'value'
       * } )
       */
      style(properties: IElementCSS | undefined): this;
      /**
       * removeStyle
       * @description Suprrime les propriétés de style de l'instance lié à l'élément
       * @param properties Tableau des propriétés à supprimer
       * @example
       * element.removeStyle( [ 'color', 'fontSize', ... ])
       */
      removeStyle(properties: IElementCSSRemoves): this;
      /**
       * toggle
       * @description Basculer sur une selecteur CSS ou pas
       * @param tokens Selecteur ou liste de sélecteur
       * @example
       * element.toggle( '.box' )
       * element.toggle( ['.box', '.card', ... ] )
       */
      toggle(tokens: IElementClassName): this;
      /**
       * className
       * @description Associé un selecteur CSS
       * @param tokens Selecteur CSS
       */
      className(tokens: IElementClassName | undefined): string[] | this;
      /**
       * removeClassName
       * @description Supprimer un selecteur CSS
       * @param tokens Selecteur CSS
       */
      removeClassName(tokens: IElementClassName): this;
      /**
       * attribute
       * @description Definit le/les attribut(s)
       * @param attributes Attributs sous form d'object
       * @param ns Nom de l'espace
       * @param separator Séparateur de nom d'espace
       */
      attribute(attributes?: IAttributesMap | undefined, ns?: string | undefined, separator?: string | undefined): this;
      /**
       * removeAttribute
       * @description Supprime le/les attribut(s)
       * @param attributes Attributs sous form d'object
       * @param ns Nom de l'espace
       * @param separator Séparateur de nom d'espace
       */
      removeAttribute(attributes: IAttributesMap, ns?: string | undefined, separator?: string | undefined): this;
      /**
       * toggleAttribute
       * @description Basculer le/les attribut(s)
       * @param attributes Attributs sous form d'object
       * @param ns Nom de l'espace
       * @param separator Séparateur de nom d'espace
       */
      toggleAttribute(attributes: IAttributesMap, ns?: string | undefined, separator?: string | undefined): this;
  }
  /**
   * AunrseAppearanceProps
   * @description Analyse la propriété de l'apparence et la réecrit
   * @param name Nom de la propriété
   * @param value Valeur de la propriété
   * @example
   * AunrseAppearanceProps<IAppearanceObject>( { color : '#777' } )
   */
  export function AunrseAppearanceProps<T extends IAppearanceObject | IAppearanceObjectDestroyed>(name: keyof IAppearanceObject, value: IAppearanceValues): T;
  /**
   * AunrseAppearanceValues
   * @description Analyse la valeur d'une propriété de l'apparence
   * @param value Valeur de la propriété
   * @example
   * AunrseAppearanceValues( ... )
   */
  export function AunrseAppearanceValues(value: IAppearanceValues): string | undefined;
  /**
   * Protorian Appearance
   * @description Gestionnaire d'apparence des éléments Protorian
   */
  export class AunAppearance implements IAppearance {
      /**
       * Instance du DOM
       */
      instance: HTMLStyleElement;
      /**
       * Signature de l'apparence
       */
      uid: string;
      /**
       * Instance de l'emetteur
       */
      emitter: AunEmitter<IAppearanceEmitterScheme>;
      /**
       * Propriétés de l'apparence
       */
      properties: IAppearanceObject;
      constructor();
      /**
       * sheet
       * C@description onstruire une feuille de style liée à l'apparence
       * @param stylesheet Definit la feuille de style
       * @example
       * appearance.sheet( {
       *    'selector' : {
       *       'property' : 'value',
       *        ...
       *    }
       * } )
       */
      sheet(stylesheet: IAppearanceStyleSheet): this;
      /**
       * insertProperties
       * @description Insert des propriétés d'apparence dans un objet support. Analyse les propriétés et les valeurs avant de les insérer
       * @param properties Propriétés d'apparence support
       * @param data Données des propriétés à insérer
       * @example
       * appearance.insertProperties( objectPropertiesSupport, objectDataToInsert )
       */
      insertProperties(properties: IAppearanceObject, data: IAppearanceObject): IAppearanceObject;
      /**
       * removeProperties
       * @description Supprime des propriétés d'apparence dans un object support.
       * @param properties Propriétés d'apparence support
       * @param payload Données des propriétés à supprimer
       * @example
       * appearance.removeProperties( objectPropertiesSupport, objectDataToRemove )
       */
      removeProperties(properties: IAppearanceObject, payload: IAppearanceObjectDestroyed): IAppearanceObject;
      /**
       * set
       * @description Insert des propriétés d'apparence. Analyse les propriétés et les valeurs avant de les insérer
       * @param properties Propriétés à insérer
       * @example
       * appearance.set( {
       *    'property' : 'value',
       *    ...
       * } )
       */
      set(properties: IAppearanceObject): this;
      /**
       * unset
       * @description Supprime des propriétés d'apparence. Analyse les propriétés et les valeurs avant.
       * @param properties Propriétés à supprimer
       * @example
       * appearance.unset( {
       *    'property' : 'value',
       *    ...
       * } )
       */
      unset(properties: IAppearanceObjectDestroyed): this;
      /**
       * mount
       * @description Monter l'apparence si ce n'est pas fait
       * @example
       * appearance.mount()
       */
      mount(): this;
      /**
       * mountImmediat
       * @description Monter l'apparence
       * @example
       * appearance.mountImmediat()
       */
      mountImmediat(): this;
      /**
       * destroy
       * @description Détruit l'apparence
       * @example
       * appearance.destroy()
       */
      destroy(): this;
      /**
       * sync
       * @description Synchronise l'apparence
       * @example
       * appearance.sync()
       */
      sync(): this;
  }
  /**
   * Protorian Attribute
   * @description Gestionnaire d'attribute dynamique
   */
  export class AunAttribute implements IAttribute {
      #private;
      /**
       * Nom de lattribut
       */
      attributeName: string;
      /**
       * Emetteur
       */
      emitter: AunEmitter<IAttributesEmitterScheme>;
      /**
       * Les entrées
       */
      get entries(): string[];
      /**
       * La valeur de l'attribut
       */
      get value(): string;
      constructor(element: HTMLElement | null, attributeName?: string);
      /**
       * sync
       * @description Synchronise les attributs
       * @param attributeName Nom de l'attribut
       * @description
       * attribut.sync()
       */
      sync(attributeName?: string): this;
      /**
       * add
       * @description Ajout une entrée à l'attribut
       * @param value Valeur de l'attribut
       * @example
       * attribut.add( ... )
       */
      add(value: string): this;
      /**
       * remove
       * @description Supprimer une entrée de l'attribut
       * @param value Valeur de l'attribut
       * @example
       * attribut.remove( ... )
       */
      remove(value: string): this;
      /**
       * replace
       * @description Remplace le valeur dans un attribut
       * @param older Ancienne valeur de l'attribut
       * @param value Nouvelle valeur de l'attribut
       * @example
       * attribut.replace( 'oldValue', 'newValue' )
       */
      replace(older: string, value: string): this;
      /**
       * contains
       * @description Recherche l'existence d'une valeur dans l'instance de l'attribut
       * @param value Valeur dans l'attribut recherché
       * @example
       * attribut.contains( 'searchValue' )
       */
      contains(value: string): boolean;
      /**
       * link
       * @description Lie un attribut à une instance du DOM
       * @example
       * attribut.link()
       */
      link(): this;
      /**
       * unlink
       * @description Supprime la liaison d'un attribut dans  l'instance
       * @param attributes Nom de l'attribut
       * @example
       * attribut.unlink( 'attributName' )
       */
      unlink(attributes?: string | string[]): this;
  }
  /**
   * Protorian State
   * @description Gestionnaire d'état
   */
  export class AunState<S extends IState> implements IStateManager<S> {
      #private;
      /**
       * Donnée de l'état
       */
      state: S;
      /**
       * Emetteur
       */
      emitter: AunEmitter<IStateManagerEmitterScheme<S>>;
      /**
       * Retourne la valeur de l'état
       */
      get value(): S;
      constructor(state: S);
      /**
       * initialize
       * @description Initialise l'état
       */
      initialize(): this;
      /**
       * set
       * @description Modifit l'état
       * @param value Nouvelle valeur de l'état
       * @example
       * state.set( ... )
       */
      set(value: S): this;
      /**
       * use
       * @description Utilise l'état
       * @param callback Fonction de rappel contenant l'état en paramètre. Cett fonction doit retourner un widget
       * @example
       * state.use( state => ... )
       */
      use(callback: IStateCallback<S>): this;
      /**
       * records
       * @description Enregistre les déclarations de l'état pour le référencement
       * @param widget Widget enregistré
       * @example
       * state.records( ... )
       */
      records(widget: IWidget<any, any>): this;
      /**
       * record
       * @description Engistre la déclaration du widget
       * @param widget Widget
       * @param record Enregistrement de la déclaration
       * @example
       * state.record( widget, record )
       */
      record(widget: IWidget<any, HTMLElement>, record: IStateRecords<any>): IStateRecords<any>;
      /**
       * sync
       * @description Synchronise l'état et les déclarations
       * @example
       * state.sync()
       */
      sync(): this;
      /**
       * catch
       * @description Gestion des érreurs
       * @param callback Fonction de rappel. Cette fonction doit retrouner un Widget
       * @example
       * state.catch( error => ... )
       */
      catch(callback: IStateErrorCallback<S>): this;
  }
  /**
   * Protorian Widget
   * @description Pour les composant HTML de base
   */
  export class AunWidget<P extends IWProps, E extends INode> implements IWidget<P, E> {
      #private;
      /**
       * Instance de l'élément
       */
      element: IElement<E>;
      /**
       * Enfant du widget
       */
      children?: IChildren | IChildren[] | undefined;
      /**
       * Les propriétés
       */
      get props(): P;
      /**
       * Emetteur
       */
      emitter: AunEmitter<IWidgetEmitterScheme<P, E>>;
      /**
       * Constructe
       */
      construct: IConstruct<P, E>;
      constructor(tagname: string, props: P);
      ready(callback: IWidgetReadyCallback<P, E>): this;
      layer(callback: IWidgetLayerCallback<E>): this;
      /**
       * appear
       * @description Definit une apparence pour le widget
       * @param payload Propriété de l'apparence
       * @example
       * widget.appear( {
       *    'property' : 'value'
       * } )
       */
      appear(payload: IAppearanceObject): this;
      /**
       * content
       * @description Definit le contenu du widget
       * @param children Contenu du widget
       * @example
       * widget.content( ... )
       */
      content(children?: IChildren | IChildren[] | undefined): this | IChildren;
      /**
       * refresh
       * @description Rafraichit un widget
       * @example
       * widget.refresh()
       */
      refresh(props?: Partial<P> | undefined): this;
      /**
       * render
       * @description Rend le widget
       */
      render(): this;
      /**
       * remove
       * @description Détruit le widget
       */
      remove(): this;
      /**
       * timeOut
       * @description Execute une fonction après un temps donnée
       * @param callback Fonction de rappel retournant un widget et le timer
       * @param time Durée du compte à rebour
       * @example
       * widget.timeOut( ( widget, timer ) => ... )
       */
      timeOut(callback: IWidgetTimerCallback, time?: number): this;
      /**
       * timeInterval
       * @description Execute une fonction à un interval de temps
       * @param callback Fonction de rappel retournant un widget et le timer
       * @param time Durée de l'interval
       * @example
       * widget.timeInterval( ( widget, timer ) => ... )
       */
      timeInterval(callback: IWidgetTimerCallback, time?: number): this;
      /**
       * frameReady
       * @description Execute une fonction quand permet l'animation des frames
       * @param callback Fonction de rappel appelent un widget en argument
       * @example
       * widget.frameReady( widget => ... )
       */
      frameReady(callback: IWidgetRequestAnimationFrameCallback): this;
  }
  /**
   * Protorian Construct
   * @description Constructeur de Widget
   */
  export class AunConstruct<P extends IWProps, E extends INode> implements IConstruct<P, E> {
      /**
       * Emetteur
       */
      emitter: AunEmitter<IConstructEmitterScheme<P, E>>;
      /**
       * Apparence
       */
      appearance: IAppearance;
      constructor();
      /**
       * make
       * @description Créer le constructeur
       * @param root Racine Widget
       * @param children Enfants à ajouter
       */
      make(root: IWidget<P, E>, children: IChildren): IWidget<P, E>;
      /**
       * makeChildren
       * @description Construire les enfants
       * @param root Racine Widget
       * @param children Enfants à ajouter
       */
      makeChildren(root: IWidget<P, E>, children: IChildren): IWidget<P, E>;
      /**
       * makeAppearance
       * @description Construire l'apparence
       * @param root
       * @param payload
       */
      makeAppearance(root: IWidget<P, E>, payload: IAppearanceObject): IWidget<P, E>;
  }
  export class AunView<ComponentProps extends IWProps> implements IView<ComponentProps> {
      #private;
      get parameters(): ComponentProps;
      get component(): IWidget<ComponentProps, HTMLDivElement> | undefined;
      componentConstructor: IComponentConstructor;
      options: IViewOptions<ComponentProps>;
      constructor(componentConstructor: IComponentConstructor, options?: IViewOptions<ComponentProps>);
      show(parameters: ComponentProps): this;
      hide(): this;
      refresh(parameters?: Partial<ComponentProps> | undefined): this;
      render(): IWidget<ComponentProps, HTMLDivElement>;
  }
  export class AunStackViews<Scheme> implements IStackViews<Scheme> {
      #private;
      /**
       * Les vues
       */
      get views(): IStackViewsList<Scheme>;
      /**
       * Options
       */
      options: IStackViewsOptions<Scheme>;
      /**
       * Système de navigation
       */
      navigation: INavigation<Scheme>;
      emitter: IEmitter<IStackViewsEmitterScheme<Scheme>>;
      constructor(views: IStackViewsList<Scheme>, options: IStackViewsOptions<Scheme>);
      middleware({ args, routeName }: INavigationMiddlewareProps<Scheme>): this;
      /**
       * Démarrage
       */
      run(): this;
  }
  /**
   * Système de navigation
   */
  export class AunNavigation<Scheme> implements INavigation<Scheme> {
      options: INavigationOptions<Scheme>;
      emitter: IEmitter<INavigationEmitterScheme<Scheme>>;
      constructor();
      currentRoute(): keyof Scheme;
      currentQuery<T>(): T | undefined;
      setOptions(options: INavigationOptions<Scheme>): this;
      middleware(middleware: INavigationMiddlewareCallback<Scheme>): this;
      observe(): this;
      capturesActions(): this;
      parseRouteName(routeName: string): string;
      isExternalURL(url: string): boolean;
      parseElementCaptured(ev: Event): HTMLElement | undefined;
      dispatchNavigate(ev?: Event | undefined): this;
      navigate(route: keyof Scheme, props?: (Scheme[keyof Scheme]), ev?: Event): this;
  }
  export class AunViewSwitcher {
  }

}
declare module 'protorian-aun/index' {
  import { AunElement, AunState, AunWidget, AunView, AunStackViews } from "protorian-aun/foundations";
  /**
   * CreateState
   * @description Instance fonctionnelle d'usage de gestion des états Protorian
   * @param state Valeur par default de l'état
   * @example CreateState<StateType>( stateValue )
   */
  export function CreateState<S extends IState>(state: S): AunState<S>;
  /**
   * DropComponent
   * @param target Balise HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur
   * @param component Composant à deposer
   * @description Lier un composant à une cicle
   * @example DropComponent<PropsType>( '#root', Component( { ... } ) )
   * DropComponent<PropsType>( document.getElementById('root'), Component( { ... } ) )
   */
  export function DropComponent<P extends IWProps, E extends INode>(component: IWidget<P, E>, target: INode): IWidget<P, E>;
  /**
   * DropComponents
   * @description Lier plusieurs composants à plusieurs cicles.
   * @param targets Balises HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur. Instancie plusieurs cicle à la fois.
   * @param component Composant à deposer dans l'élément HTML
   * @example DropComponents<PropsType, HTMLDivElement>( '.drop-target', ( props : Props ) => ... )
   */
  export function DropComponents<P extends IWProps, E extends INode>(component: IWidget<P, E>, targets: NodeListOf<INode>): IWidget<P, E>;
  /**
   * InstantiateComponent
   * @description Instancier un composant. Cela permet de garder l'instance courante du composant avec les propriétés définies. À utiliser dans les cas l'IDE n'arrive pas typer correctement les variables.
   * @param component Composant cible
   * @example InstantiateComponent( component( props ) )
   */
  export function InstantiateComponent(component: IWidget<any, any>): IWidget<any, any>;
  /**
   * AsyncComponent
   * @description Utiliser un composant avec une promesse. Composant bloquant en attendant le traitement. Il peut être ajouter aux enfants d'un widget
   * @param callback Fonction de renvoie pour le traitement d'un promesse. Puis renvoyer un composant instancié
   * @example AsyncComponent( ( resolve, reject ) => {
   *    setTimeout( () => resolve( component() ), 3000 )
   * })
   */
  export function AsyncComponent<P extends IWProps, E extends INode>(callback: IWidgetAsyncCallback): Promise<IWidget<P, E>>;
  /**
   * UseComponent
   * @description Utiliser un composant dans une / plusieurs cibles
   * @param target Balises HTML cible où deposer le composant. La valeur peut être un Element HTML ou une requete de selecteur. Instancie plusieurs cicle à la fois.
   * @param component Composant instancié
   * @example UseComponent<PropsType>( '#root', component( props ) ) // Requête de selecteur pour la cible
   * UseComponent<PropsType>( document.getElementById('root'), component( props ) ) // Instance de type HTMLElement pour la cible
   */
  export function UseComponent<P extends IWProps, E extends INode>(component: IWidget<any, any>, target: IWTarget): IWidget<P, E>;
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
  export function CreateKit(definition: IKitProps): <P extends IWProps, E extends HTMLElement>(p: P) => IWidget<P, E>;
  /**
   * aun — Protorian Virtual Element
   * @description Instance fonctionnelle d'usage des éléments Protorian
   * @param tagname Nom de la balise HTML
   * @example aun<HTMLSpanElement>( 'span' )
   */
  export function aune<E extends INode>(tagname: string): AunElement<E>;
  /**
   * VWidget
   * @description Instance fonctionnelle d'usage des Widgets Protorian
   * @param tagname Nom de la balise HTML
   * @param props Propriétés du widget
   * @example VWidget<PropsType, HTMLSpanElement>( 'span', props )
   */
  export function VWidget<P extends IWProps, E extends INode>(tagname: string, props: P): AunWidget<P, E>;
  /**
   * Widget
   * @description Créer une couche de calque
   * @param props Propriétés du widget. La propriété `children` représente les enfants du widget (contenu)
   * @example Widget<PropsType>({
   * children: ...
   * otherProp: ...
   * })
   */
  export function Widget<P extends IWProps>(props: P): AunWidget<P, HTMLDivElement>;
  /**
   * Textual
   * @description Calque destiné aux textes
   * @param props Propriétés du widget. La propriété `children` représente les enfants du widget (contenu)
   * @example Textual<PropsType>({
   * children: ...
   * otherProp: ...
   * })
   */
  export function TextWidget<P extends IWProps>(props: P): AunWidget<P, HTMLSpanElement>;
  export function View<C extends IWProps>(component: IComponentConstructor, options?: IViewOptions<C> | undefined): AunView<C>;
  export function CreateStackViews<Scheme>(views: IStackViewsList<Scheme>, options?: IStackViewsOptions<Scheme>): AunStackViews<Scheme>;
  /**
   * Protorian Construct
   * @description Construire un composant à partir des enfants
   * @param component Composant cible
   * @param children Enfant à injecter
   * @example Construct<ComponentType>( component, children )
   * Construct( component, children )
   */
  export function Construct<Component extends IWidget<IWProps, INode>>(component: Component, children: IChildren): IWidget<IWProps, HTMLElement>;
  /**
   * CreateComponent
   * @description Créer un composant en ajoutant immédiatement à la fil d'attente hydratation tout en permetant de l'exporter avec un nom d'emprunt.
   * @param name
   * @param widgetConstructor
   * @example export const HelloWord = CreateComponent<PropType>('HelloWorld', ( props : IWProps ) => ... )
   */
  export function CreateComponent<P extends IWProps>(name: string, widgetConstructor: IHydrateComponent<any, HTMLElement>): IHydrateComponent<P, HTMLElement>;
  /**
   * HydrateComponentQueue
   * @description Fil d'attente des hydration des composants Protorian
   * @param name CNom du composant. Sensible à la case
   * @param widgetConstructor Constructeur du composant Protorian
   * @example HydrateComponentQueue<WidgetPropsType>( 'ComponentName', ( props : WidgetProps ) => ... )
   */
  export function HydrateComponentQueue<P extends IWProps>(name: string, widgetConstructor: IHydrateComponent<any, HTMLElement>): IHydrateComponent<any, HTMLElement>;
  /**
   * HydrateComponent
   * @param name Chaine de caratère représentant le nom du composant. Sensible à la case
   * @param widgetConstructor Constructeur du composant Protorian
   * @example HydrateComponent<PropsType>( 'Hello', HelloComponent )
   */
  export function HydrateComponent<P extends IWProps>(name: string, widgetConstructor: IHydrateComponent<any, HTMLElement>): IHydrateComponent<any, HTMLElement>;
  /**
   * ExtractProps
   * @description Extraction des propriétés dans le constructeur d'un composant
   * @param attributes Contenu de la propriété "HTMLElement.attributes"
   * @example ExtractProps<PropsType>( element.attributes )
   */
  export function ExtractProps<P extends IWProps>(attributes: NamedNodeMap): P;
  /**
   * ActiveAutoHydrateComponents
   * @description Active l'hydratation automatique des composants
   * @example ActiveAutoHydrateComponents()
   */
  export function ActiveAutoHydrateComponents(): MutationObserver;
  /**
   * Protorian
   * @description Exportations des fonctionnalités de base du framework
   */
  export default class Protorian {
      /**
       * aun — Protorian Virtual Element
       * @description Instance fonctionnelle d'usage des éléments Protorian
       */
      static VirtualElement: typeof aune;
      /**
       * VWidget
       * @description Instance fonctionnelle d'usage des Widgets Protorian
       */
      static VWidget: typeof VWidget;
      /**
       * Construct
       * @description Construire un composant via AunConstruct
       */
      static Construct: typeof Construct;
      /**
       * Widget
       * @description Créer une couche de calque
       */
      static Widget: typeof Widget;
      /**
       * Textual
       * @description Calque destiné aux textes
       */
      static Textual: typeof TextWidget;
      /**
       * CreateState
       * @description Instance fonctionnelle d'usage de gestion des états Protorian
       */
      static CreateState: typeof CreateState;
      /**
       * DropComponent
       * @description Lier un composant à une cicle
       */
      static DropComponent: typeof DropComponent;
      /**
       * DropComponents
       * @description Lier plusieurs composants à plusieurs cicles
       */
      static DropComponents: typeof DropComponents;
      /**
       * InstantiateComponent
       * @description Instancier un composant. Cela permet de garder l'instance courante du composant avec les propriétés définies
       */
      static InstantiateComponent: typeof InstantiateComponent;
      /**
       * AsyncComponent
       * @description Utiliser un composant avec une promesse. Composant bloquant en attendant le traitement.
       */
      static AsyncComponent: typeof AsyncComponent;
      /**
       * UseComponent
       * @description Utiliser un composant dans une / plusieurs cibles
       */
      static UseComponent: typeof UseComponent;
  }

}
declare module 'protorian-aun/metric' {
  export class MetricRandom {
      static ALPHA_NUMERIC: string;
      static ALPHA_NUMERIC_LOWER: string;
      static ALPHA_NUMERIC_UPPER: string;
      static ALPHA_UPPER: string;
      static ALPHA_LOWER: string;
      static HEX_UPPER: string;
      static HEX_LOWER: string;
      static NUMERIC: string;
      static CreateRandom(min: number, max: number): number;
      static CreateBlock(base: string, length: number): string[];
      static CreateAplpha(length: number): string[];
      static CreateHEX(length: number): string[];
      static CreateNumeric(length: number): string[];
      static Create(length: number): string[];
  }

}
declare module 'protorian-aun/utilities' {
  /**
   * URLParamsObject
   * @param searchParams Chaine de caractère des paramètres
   */
  export function URLParamsObject<T>(searchParams: string): T | undefined;
  /**
   * BrowseDOMPath
   * @description Parcour l'arbre de parent d'un element. Une fonction de validation peut stopper le parcour en retournant true. Chaque parent parcourut est renvoyer via la fonction de validation
   * @param child Element à parcourir
   * @param validator Fonction de validation
   * @example
   * BrowseDOMPath( element, ( parent ) => ... )
   */
  export function AscendingDOMPath<T extends Node | HTMLElement>(child: T, validator: (parent: T) => boolean): T | undefined;
  /**
   * UpdateObject
   * @description Mise à jour d'un objet à partir d'un autre objet
   * @param originalObject Object original
   * @param parameters À injecter
   */
  export function UpdateObject<T>(originalObject: T, parameters?: Partial<T> | undefined): T;
  /**
   * AttributesValuesAunrser
   * @description Analyse et donne la valeur en fonction du type
   * @param value Valeur de l'attribute
   * @example AttributesValuesAunrser( data )
   */
  export function AttributesValuesAunrser(value: IAttributesMapValues): IAttributesMapValues;
  /**
   * AttributesObject
   * @param attributes Charge utile
   * @param ns nom de l'espace — `ui:button="success"`
   * @param separator Chaine de caratère entre le nom d'espace et le nom de l'attribut
   */
  export function AttributesObject<T extends IAttributesMap>(attributes: IAttributesMap, ns?: string | undefined, separator?: string | undefined): T;
  export function ObjectToString(payload: object, c?: IObjectToString): string;
  /**
   * SafeText
   * @description Désactiver les crochets et quotes dans du texte
   */
  export function safeText(text: string): string;
  /**
   * SafeText
   * @description Activer les crochets et quotes dans du texte
   */
  export function unSafeText(text: string): string;
  /**
   * addSlashes
   * @description Désactiver les crochets et quotes dans du texte
   */
  export function AddSlashes(text: string): string;
  /**
   * stripSlashes
   * @description Désactiver les crochets et quotes dans du texte
   */
  export function StripSlashes(text: string): string;
  /**
   * uncamelize
   */
  export function UnCamelize(value: string): string;
  /**
   * camelize
   */
  export function Camelize(value: string): string;

}
declare module 'protorian-aun' {
  import main = require('protorian-aun/index');
  export = main;
}
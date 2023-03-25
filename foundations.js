var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _AunElement_widget, _AunAttribute_entries, _AunAttribute_element, _AunState_instances, _AunState_mirror, _AunState_recorded, _AunState_current, _AunState_emitters, _AunWidget_instances, _AunWidget__props, _AunWidget_excavation, _AunView__parameters, _AunView__component, _AunStackViews_views;
import { MetricRandom } from "./metric";
import { AttributesObject, AscendingDOMPath, ObjectToString, UnCamelize, UpdateObject, URLParamsObject } from "./utilities";
/**
 * fe — Find Element
 * @param find Recherché
 * @param callback Fonction de rappel contenant l'element html en argument
 */
export function fe(find, callback) {
    const fn = callback || new Function();
    let target = undefined;
    if (find) {
        if (typeof find == 'string') {
            target = document.querySelectorAll(find);
            target.forEach(element => fn(element));
        }
        else if (find instanceof NodeList) {
            target = find;
            target.forEach(element => fn(element));
        }
        else if (find instanceof HTMLElement) {
            target = find;
            fn(target);
        }
        else if (find instanceof AunElement) {
            target = find.instance;
            fn(target);
        }
    }
    return target;
}
/**
 * Protorian EventDispatcher — Emetteur d'émission
 * @description Gestionnaire d'évènements
 * @example new AunEmitter<EmitScheme>()
 */
export default class AunEmitter {
    constructor() {
        /**
         * Gestion de la propagation
         */
        this.propagations = {};
        /**
         * Stockage des émissions
         */
        this.entries = {};
    }
    /**
     * Ecouter une émission de l'émetteur
     * @description Ecouteur d'évèvements par rapport à un "SLUG". Utiliser un retour "TRUE" pour stopper la propagation de l'instance déclenchée
     * @param type Type d'émission déclaré dans le `Scheme` de l'instanciation
     * @param callback Fonction de rappel content en `argument[0]` les données définit par le dispatcher
     * @example emitter.listen<ReturnType>( 'emitterNameInKeyOfScheme', ( data : ReturnType ) => ... )
     */
    listen(type, callback, force) {
        this.entries[type] = this.entries[type] || [];
        this.entries[type].push({ callback, force });
        this.propagations[type] = false;
        return this;
    }
    /**
     * Déclencheur un type d'émission de l'émetteur
     * @description Déclencheur les écouteurs par rapport au `type`
     * @param type Type d'émission déclaré dans le `Scheme` de l'instanciation
     * @param data Donnée à renvoyer aux écouteurs d'émission de l'émeteur
     * @example emitter.dispatch( 'emitterNameInKeyOfScheme', ... )
     *
     */
    dispatch(type, data) {
        if (this.entries[type]) {
            this.entries[type].map((entry) => {
                if (this.propagations[type] === true) {
                    return;
                }
                const stop = entry.callback(data);
                if (stop === true) {
                    this.propagations[type] = true;
                }
            });
            this.propagations[type] = false;
        }
        return this;
    }
}
/**
 * Protorian Element
 * @description Encapscule l'lement HTML pour un usage optimal
 * @example AunElement<HTMLDivElement>('div')
 */
export class AunElement {
    constructor(tagname) {
        /**
         * Emetteur
         */
        this.emitter = new AunEmitter();
        _AunElement_widget.set(this, undefined);
        this.instance = document.createElement(tagname);
    }
    /**
     * Widget associé
     */
    get widget() { return __classPrivateFieldGet(this, _AunElement_widget, "f"); }
    /**
     * own
     * @description Définit le widget propriétaire de l'élément
     * @param widget Widget Cible
     * @example element.own( widget )
     */
    own(widget) {
        __classPrivateFieldSet(this, _AunElement_widget, widget, "f");
        this.emitter.dispatch('own', widget);
        return this;
    }
    /**
     * asyncMeasure
     * @description Retrouve les dimension et le position de l'instance de l'élément en retournant les valeurs.
     * Ceci permet d'enchaine avec une autre methode
     * @example element.asyncMeasure()
     */
    asyncMeasure() {
        const data = this.instance.getBoundingClientRect();
        this.emitter.dispatch('measure', data);
        return data;
    }
    /**
     * measure
     * @description Execute asyncMeasure mais avec un callback
     * @param callback Fonction de rappel retournant la valeur en argument
     * @example element.measure( measure => ... )
     */
    measure(callback) {
        callback(this.asyncMeasure());
        return this;
    }
    /**
     * clean
     * @description Nettoie le contenu de l'instance de l'élément
     * @example element.clean()
     */
    clean() {
        Object.values(this.instance.children).forEach(child => child.remove());
        this.emitter.dispatch('clean', undefined);
        return this;
    }
    /**
     * remove
     * @description Supprime l'élément
     * @example element.remove()
     */
    remove() {
        this.instance.remove();
        this.emitter.dispatch('remove', undefined);
        return this;
    }
    /**
     * asyncOffset
     * @description Retrouve les valeurs de l'`offset` de l'intance de l'élément en les retournant
     * @example element.asyncOffset()
     */
    asyncOffset() {
        const data = {
            height: this.instance.offsetHeight,
            width: this.instance.offsetWidth,
            top: this.instance.offsetTop,
            left: this.instance.offsetLeft,
            parent: this.instance.offsetParent,
        };
        this.emitter.dispatch('offset', data);
        return data;
    }
    /**
     * offset
     * @description Exécute `asyncOffset` mais avec une fonction de rappel.
     * Ceci permet d'enchaine avec une autre methode
     * @param callback Fonction de rappel retournant la valeur en argument
     * @example element.offset( offset => ... )
     */
    offset(callback) {
        callback(this.asyncOffset());
        return this;
    }
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
    content(children) {
        if (typeof children != 'undefined') {
            this.widget?.construct.make(this.widget, children);
            this.emitter.dispatch('content', children);
            return this;
        }
        return this.widget?.children;
    }
    /**
     * html
     * @description Définit un contenu HTML dans l'élément
     * @param data Contenu HTML
     * @example
     * element.html( 'string' )
     */
    html(data) {
        if (typeof data != 'undefined') {
            this.instance.innerHTML = data;
            this.emitter.dispatch('html', data);
            return this;
        }
        return this.instance.innerHTML;
    }
    /**
     * append
     * @description Ajout un noeud ou une chaine de caratère à l'élément
     * @param nodes Noeud ou chaine de caratère
     * @example
     * element.append( 'string' )
     * element.append( document.querySelector('.box') )
     */
    append(...nodes) {
        this.instance.append(...nodes);
        this.emitter.dispatch('append', nodes);
        return this;
    }
    /**
     * listen
     * @description Écoute l'emetteur gréffé à l'élément
     * @param type Type d'émission
     * @param callback Fonction de rappel retournant la valeur associé au `type`
     * @example
     * element.listen( 'EMITTER_TYPE', data => ... )
     * element.listen<IElementEmitterScheme>( 'EMITTER_TYPE', data => ... )
     */
    listen(type, callback) {
        this.emitter.listen(type, callback);
        return this;
    }
    /**
     * on
     * @description Écoute les évènement gréffé à l'instance de l'élément
     * @param type
     * @param callback
     * @param options
     * @example
     * element.on<PointerEvent>( 'LISTENER_TYPE', ev => ... )
     */
    on(type, callback, options) {
        this.instance.addEventListener(type, callback, options);
        this.emitter.dispatch('on', { type, callback, options });
        return this;
    }
    /**
     * style
     * @description Définit le style de l'instance lié à l'élément
     * @param properties Propriétés et valeurs à définir
     * @example
     * element.style( {
     *    'property': 'value'
     * } )
     */
    style(properties) {
        if (properties) {
            Object.entries(properties).forEach(({ 0: name, 1: value }) => {
                this.instance.style[name] = `${value}`;
            });
            this.emitter.dispatch('style', properties);
        }
        return this;
    }
    /**
     * removeStyle
     * @description Suprrime les propriétés de style de l'instance lié à l'élément
     * @param properties Tableau des propriétés à supprimer
     * @example
     * element.removeStyle( [ 'color', 'fontSize', ... ])
     */
    removeStyle(properties) {
        if (Array.isArray(properties)) {
            properties.forEach(name => {
                this.instance.style.removeProperty(name);
            });
            this.emitter.dispatch('removeStyle', properties);
        }
        else if (typeof properties == 'string') {
            this.instance.style.removeProperty(properties);
            this.emitter.dispatch('removeStyle', properties);
        }
        return this;
    }
    /**
     * toggle
     * @description Basculer sur une selecteur CSS ou pas
     * @param tokens Selecteur ou liste de sélecteur
     * @example
     * element.toggle( '.box' )
     * element.toggle( ['.box', '.card', ... ] )
     */
    toggle(tokens) {
        if (Array.isArray(tokens)) {
            tokens.forEach(name => {
                this.instance.classList.toggle(name);
            });
            this.emitter.dispatch('toggle', tokens);
        }
        else if (typeof tokens == 'string') {
            this.instance.classList.toggle(tokens);
            this.emitter.dispatch('toggle', tokens);
        }
        return this;
    }
    /**
     * className
     * @description Associé un selecteur CSS
     * @param tokens Selecteur CSS
     */
    className(tokens) {
        if (tokens) {
            if (typeof tokens == 'string') {
                this.instance.classList.add(tokens);
                this.emitter.dispatch('className', tokens);
            }
            else if (Array.isArray(tokens)) {
                tokens.forEach(token => this.instance.classList.add(token));
                this.emitter.dispatch('className', tokens);
            }
            return this;
        }
        return this.instance.className.split(' ');
    }
    /**
     * removeClassName
     * @description Supprimer un selecteur CSS
     * @param tokens Selecteur CSS
     */
    removeClassName(tokens) {
        if (Array.isArray(tokens)) {
            tokens.forEach(name => {
                this.instance.classList.remove(name);
            });
            this.emitter.dispatch('removeClassName', tokens);
        }
        else if (typeof tokens == 'string') {
            this.instance.classList.remove(tokens);
            this.emitter.dispatch('removeClassName', tokens);
        }
        return this;
    }
    /**
     * attribute
     * @description Definit le/les attribut(s)
     * @param attributes Attributs sous form d'object
     * @param ns Nom de l'espace
     * @param separator Séparateur de nom d'espace
     */
    attribute(attributes, ns, separator) {
        if (attributes) {
            Object.entries(AttributesObject(attributes, ns, separator))
                .forEach(({ 0: name, 1: attribute }) => {
                this.instance.setAttribute(name, `${attribute}`);
            });
        }
        return this;
    }
    /**
     * removeAttribute
     * @description Supprime le/les attribut(s)
     * @param attributes Attributs sous form d'object
     * @param ns Nom de l'espace
     * @param separator Séparateur de nom d'espace
     */
    removeAttribute(attributes, ns, separator) {
        Object.keys(AttributesObject(attributes, ns, separator))
            .forEach(name => {
            this.instance.removeAttribute(name);
        });
        return this;
    }
    /**
     * toggleAttribute
     * @description Basculer le/les attribut(s)
     * @param attributes Attributs sous form d'object
     * @param ns Nom de l'espace
     * @param separator Séparateur de nom d'espace
     */
    toggleAttribute(attributes, ns, separator) {
        Object.entries(AttributesObject(attributes, ns, separator))
            .forEach(({ 0: name, 1: forced }) => {
            this.instance.toggleAttribute(name, forced);
        });
        return this;
    }
}
_AunElement_widget = new WeakMap();
/**
 * AunrseAppearanceProps
 * @description Analyse la propriété de l'apparence et la réecrit
 * @param name Nom de la propriété
 * @param value Valeur de la propriété
 * @example
 * AunrseAppearanceProps<IAppearanceObject>( { color : '#777' } )
 */
export function AunrseAppearanceProps(name, value) {
    const keys = [];
    const parsed = {};
    /**
     * Réecriture
     */
    switch (name) {
        case 'paddingVertical':
            keys.push('paddingTop');
            keys.push('paddingBottom');
            break;
        case 'paddingHorizontal':
            keys.push('paddingLeft');
            keys.push('paddingRight');
            break;
        case 'marginVertical':
            keys.push('marginTop');
            keys.push('marginBottom');
            break;
        case 'marginHorizontal':
            keys.push('marginLeft');
            keys.push('marginRight');
            break;
        default:
            keys.push(name);
            break;
    }
    /**
     * Injection
     */
    keys.forEach(key => {
        parsed[UnCamelize(key)] = AunrseAppearanceValues(value);
    });
    return parsed;
}
/**
 * AunrseAppearanceValues
 * @description Analyse la valeur d'une propriété de l'apparence
 * @param value Valeur de la propriété
 * @example
 * AunrseAppearanceValues( ... )
 */
export function AunrseAppearanceValues(value) {
    if (typeof value == 'number') {
        return `${value}`;
    }
    return value;
}
/**
 * Protorian Appearance
 * @description Gestionnaire d'apparence des éléments Protorian
 */
export class AunAppearance {
    constructor() {
        /**
         * Instance de l'emetteur
         */
        this.emitter = new AunEmitter();
        /**
         * Propriétés de l'apparence
         */
        this.properties = {};
        this.instance = document.createElement('style');
        this.uid = `${MetricRandom.CreateAplpha(4).join('')}-${MetricRandom.Create(12).join('')}`;
    }
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
    sheet(stylesheet) {
        const styleSheet = [];
        Object.entries(stylesheet).forEach(({ 0: name, 1: props }) => {
            const properties = {};
            const selector = (name.includes('&'))
                ? name.replace(new RegExp('&', 'g'), `.${this.uid}`)
                : `.${this.uid} ${name}`;
            const data = this.insertProperties(properties, props);
            styleSheet[styleSheet.length] = `${selector}{ ${ObjectToString(data, { joiner: '; ' })} }`;
        });
        this.instance.innerHTML = styleSheet.join(' ');
        this.mountImmediat();
        return this;
    }
    /**
     * insertProperties
     * @description Insert des propriétés d'apparence dans un objet support. Analyse les propriétés et les valeurs avant de les insérer
     * @param properties Propriétés d'apparence support
     * @param data Données des propriétés à insérer
     * @example
     * appearance.insertProperties( objectPropertiesSupport, objectDataToInsert )
     */
    insertProperties(properties, data) {
        Object.entries(data).forEach(({ 0: name, 1: value }) => {
            Object.entries(AunrseAppearanceProps(name, value)).forEach(({ 0: key, 1: data }) => properties[key] = data);
        });
        this.emitter.dispatch('insertProperties', properties);
        return properties;
    }
    /**
     * removeProperties
     * @description Supprime des propriétés d'apparence dans un object support.
     * @param properties Propriétés d'apparence support
     * @param payload Données des propriétés à supprimer
     * @example
     * appearance.removeProperties( objectPropertiesSupport, objectDataToRemove )
     */
    removeProperties(properties, payload) {
        Object.values(payload).forEach(name => {
            Object.entries(AunrseAppearanceProps(name, undefined)).forEach(({ 0: key }) => properties[key] = undefined);
        });
        this.emitter.dispatch('removeProperties', properties);
        return properties;
    }
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
    set(properties) {
        this.insertProperties(this.properties, properties);
        this.emitter.dispatch('set', properties);
        return this.sync();
    }
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
    unset(properties) {
        this.removeProperties(this.properties, properties);
        this.emitter.dispatch('unset', properties);
        return this.sync();
    }
    /**
     * mount
     * @description Monter l'apparence si ce n'est pas fait
     * @example
     * appearance.mount()
     */
    mount() {
        const length = Object.values(this.properties).length;
        if (!this.instance.isConnected && length) {
            this.mountImmediat();
        }
        return this;
    }
    /**
     * mountImmediat
     * @description Monter l'apparence
     * @example
     * appearance.mountImmediat()
     */
    mountImmediat() {
        let head = document.querySelector('head');
        if (!head) {
            head = document.createElement('head');
            document.documentElement.append(head);
        }
        head.append(this.instance);
        this.emitter.dispatch('mount', this);
        return this;
    }
    /**
     * destroy
     * @description Détruit l'apparence
     * @example
     * appearance.destroy()
     */
    destroy() {
        this.instance.remove();
        this.emitter.dispatch('destroy', undefined);
        return this;
    }
    /**
     * sync
     * @description Synchronise l'apparence
     * @example
     * appearance.sync()
     */
    sync() {
        const rendering = [];
        Object.entries(this.properties).forEach(({ 0: name, 1: value }) => {
            if (typeof value == 'string' || typeof value == 'number') {
                rendering[rendering.length] = `${UnCamelize(name)} : ${value}`;
            }
        });
        this.instance.innerHTML = `.${this.uid}{ ${rendering.join(';')} }`;
        this.emitter.dispatch('sync', this);
        this.mount();
        return this;
    }
}
/**
 * Protorian Attribute
 * @description Gestionnaire d'attribute dynamique
 */
export class AunAttribute {
    constructor(element, attributeName = '') {
        _AunAttribute_entries.set(this, []);
        _AunAttribute_element.set(this, null);
        /**
         * Nom de lattribut
         */
        this.attributeName = '';
        /**
         * Emetteur
         */
        this.emitter = new AunEmitter();
        __classPrivateFieldSet(this, _AunAttribute_element, element, "f");
        this.attributeName = attributeName;
        this.sync(this.attributeName);
    }
    /**
     * Les entrées
     */
    get entries() { return __classPrivateFieldGet(this, _AunAttribute_entries, "f"); }
    /**
     * La valeur de l'attribut
     */
    get value() { return __classPrivateFieldGet(this, _AunAttribute_entries, "f").filter(value => value.trim().length).join(' ').trim(); }
    /**
     * sync
     * @description Synchronise les attributs
     * @param attributeName Nom de l'attribut
     * @description
     * attribut.sync()
     */
    sync(attributeName) {
        this.attributeName = attributeName || this.attributeName;
        (__classPrivateFieldGet(this, _AunAttribute_element, "f")?.getAttribute(`${this.attributeName}`) || '').split(' ')
            .filter(value => value.trim().length)
            .map(value => this.add(`${value.trim()}`));
        this.emitter.dispatch('sync', { entries: __classPrivateFieldGet(this, _AunAttribute_entries, "f") });
        return this;
    }
    /**
     * add
     * @description Ajout une entrée à l'attribut
     * @param value Valeur de l'attribut
     * @example
     * attribut.add( ... )
     */
    add(value) {
        if (!this.contains(value)) {
            __classPrivateFieldGet(this, _AunAttribute_entries, "f").push(value);
            this.emitter.dispatch('add', { added: value });
        }
        return this;
    }
    /**
     * remove
     * @description Supprimer une entrée de l'attribut
     * @param value Valeur de l'attribut
     * @example
     * attribut.remove( ... )
     */
    remove(value) {
        __classPrivateFieldSet(this, _AunAttribute_entries, __classPrivateFieldGet(this, _AunAttribute_entries, "f").filter(entry => entry != value), "f");
        this.emitter.dispatch('remove', { removed: value });
        return this;
    }
    /**
     * replace
     * @description Remplace le valeur dans un attribut
     * @param older Ancienne valeur de l'attribut
     * @param value Nouvelle valeur de l'attribut
     * @example
     * attribut.replace( 'oldValue', 'newValue' )
     */
    replace(older, value) {
        this.remove(older).add(value);
        this.emitter.dispatch('replace', { older, newer: value });
        return this;
    }
    /**
     * contains
     * @description Recherche l'existence d'une valeur dans l'instance de l'attribut
     * @param value Valeur dans l'attribut recherché
     * @example
     * attribut.contains( 'searchValue' )
     */
    contains(value) {
        return __classPrivateFieldGet(this, _AunAttribute_entries, "f").includes(value, 0);
    }
    /**
     * link
     * @description Lie un attribut à une instance du DOM
     * @example
     * attribut.link()
     */
    link() {
        __classPrivateFieldGet(this, _AunAttribute_element, "f")?.setAttribute(this.attributeName, `${this.value}`);
        this.emitter.dispatch('link', this);
        return this;
    }
    /**
     * unlink
     * @description Supprime la liaison d'un attribut dans  l'instance
     * @param attributes Nom de l'attribut
     * @example
     * attribut.unlink( 'attributName' )
     */
    unlink(attributes) {
        if (attributes) {
            if (Array.isArray(attributes)) {
                attributes.map(attribute => this.remove(attribute));
            }
            __classPrivateFieldGet(this, _AunAttribute_element, "f")?.setAttribute(this.attributeName, `${this.value}`);
            this.emitter.dispatch('unlink', { value: attributes || this.value });
        }
        else {
            __classPrivateFieldGet(this, _AunAttribute_element, "f")?.removeAttribute(this.attributeName);
            this.emitter.dispatch('unlinks', this);
        }
        return this;
    }
}
_AunAttribute_entries = new WeakMap(), _AunAttribute_element = new WeakMap();
/**
 * Protorian State
 * @description Gestionnaire d'état
 */
export class AunState {
    constructor(state) {
        _AunState_instances.add(this);
        _AunState_mirror.set(this, void 0);
        _AunState_recorded.set(this, []);
        _AunState_current.set(this, undefined);
        /**
         * Emetteur
         */
        this.emitter = new AunEmitter();
        this.state = state;
        __classPrivateFieldSet(this, _AunState_mirror, state, "f");
        // this.#store = state;
        __classPrivateFieldGet(this, _AunState_instances, "m", _AunState_emitters).call(this).initialize();
    }
    /**
     * Retourne la valeur de l'état
     */
    get value() { return __classPrivateFieldGet(this, _AunState_mirror, "f"); }
    /**
     * initialize
     * @description Initialise l'état
     */
    initialize() {
        const driver = this;
        /**
         * Initialize le detecteur d'état sur des objets
         */
        if (this.state && typeof this.state == 'object') {
            __classPrivateFieldSet(this, _AunState_mirror, (new Proxy(Object.assign({}, this.state), {
                set(target, prop, newValue) {
                    if (typeof prop == 'string') {
                        //@ts-ignore
                        target[prop] = newValue;
                    }
                    driver.emitter.dispatch('change', newValue);
                    return newValue;
                },
            })), "f");
            this.emitter.dispatch('init', this.state);
        }
        /**
         * Initialize le detecteur d'état sur les autres types de données
         */
        else {
            Object.defineProperty(this, 'state', {
                set(value) {
                    __classPrivateFieldSet(driver, _AunState_mirror, value, "f");
                    driver.emitter.dispatch('change', value);
                },
                get() {
                    const value = __classPrivateFieldGet(driver, _AunState_mirror, "f");
                    // driver.emitter.dispatch('change', value )
                    return value;
                }
            });
            this.emitter.dispatch('init', this.state);
        }
        return this;
    }
    /**
     * set
     * @description Modifit l'état
     * @param value Nouvelle valeur de l'état
     * @example
     * state.set( ... )
     */
    set(value) {
        if (this.state && value &&
            typeof this.state == 'object' &&
            typeof value == 'object') {
            try {
                Object.entries(Object.assign({}, value)).forEach(({ 0: prop, 1: data }) => {
                    if (__classPrivateFieldGet(this, _AunState_mirror, "f") && typeof __classPrivateFieldGet(this, _AunState_mirror, "f") == 'object') {
                        __classPrivateFieldGet(this, _AunState_mirror, "f")[prop] = data;
                    }
                });
            }
            catch (err) { }
        }
        else {
            this.state = value;
        }
        return this;
    }
    /**
     * use
     * @description Utilise l'état
     * @param callback Fonction de rappel contenant l'état en paramètre. Cett fonction doit retourner un widget
     * @example
     * state.use( state => ... )
     */
    use(callback) {
        __classPrivateFieldGet(this, _AunState_recorded, "f").push({
            anchor: undefined,
            widget: undefined,
            callback
        });
        return this;
    }
    /**
     * records
     * @description Enregistre les déclarations de l'état pour le référencement
     * @param widget Widget enregistré
     * @example
     * state.records( ... )
     */
    records(widget) {
        __classPrivateFieldGet(this, _AunState_recorded, "f").forEach(record => this.record(widget, record));
        return this;
    }
    /**
     * record
     * @description Engistre la déclaration du widget
     * @param widget Widget
     * @param record Enregistrement de la déclaration
     * @example
     * state.record( widget, record )
     */
    record(widget, record) {
        const anchor = document.createTextNode('');
        record.anchor = anchor;
        record.widget = widget;
        widget.element.instance.append(record.anchor);
        return record;
    }
    /**
     * sync
     * @description Synchronise l'état et les déclarations
     * @example
     * state.sync()
     */
    sync() {
        try {
            __classPrivateFieldGet(this, _AunState_recorded, "f").forEach(record => {
                if (record.widget && record.anchor) {
                    __classPrivateFieldSet(this, _AunState_current, record.callback(this.value), "f");
                    record.anchor.parentNode?.replaceChild(__classPrivateFieldGet(this, _AunState_current, "f").element.instance, record.anchor);
                    record.anchor = __classPrivateFieldGet(this, _AunState_current, "f").element.instance;
                }
            });
        }
        catch (err) {
            this.emitter.dispatch('error', err);
        }
        return this;
    }
    /**
     * catch
     * @description Gestion des érreurs
     * @param callback Fonction de rappel. Cette fonction doit retrouner un Widget
     * @example
     * state.catch( error => ... )
     */
    catch(callback) {
        this.emitter.listen('error', (error) => callback({ manager: this, error }));
        return this;
    }
}
_AunState_mirror = new WeakMap(), _AunState_recorded = new WeakMap(), _AunState_current = new WeakMap(), _AunState_instances = new WeakSet(), _AunState_emitters = function _AunState_emitters() {
    this.emitter.listen('change', () => {
        this.sync();
    });
    return this;
};
/**
 * Protorian Widget
 * @description Pour les composant HTML de base
 */
export class AunWidget {
    constructor(tagname, props) {
        _AunWidget_instances.add(this);
        _AunWidget__props.set(this, void 0);
        /**
         * Emetteur
         */
        this.emitter = new AunEmitter();
        /**
         * Constructe
         */
        this.construct = new AunConstruct();
        __classPrivateFieldSet(this, _AunWidget__props, props, "f");
        this.element = (new AunElement(tagname)).own(this);
        __classPrivateFieldGet(this, _AunWidget_instances, "m", _AunWidget_excavation).call(this, this.props);
    }
    /**
     * Les propriétés
     */
    get props() { return __classPrivateFieldGet(this, _AunWidget__props, "f"); }
    ready(callback) {
        this.emitter.listen('ready', widget => callback(widget));
        return this;
    }
    layer(callback) {
        callback(this.element);
        return this;
    }
    /**
     * appear
     * @description Definit une apparence pour le widget
     * @param payload Propriété de l'apparence
     * @example
     * widget.appear( {
     *    'property' : 'value'
     * } )
     */
    appear(payload) {
        this.construct.makeAppearance(this, payload);
        return this;
    }
    /**
     * content
     * @description Definit le contenu du widget
     * @param children Contenu du widget
     * @example
     * widget.content( ... )
     */
    content(children) {
        if (this.children) {
            const nchildren = [];
            nchildren.forEach(child => nchildren.push(child));
        }
        this.construct.make(this, children);
        this.children = children;
        return this;
    }
    /**
     * refresh
     * @description Rafraichit un widget
     * @example
     * widget.refresh()
     */
    refresh(props) {
        this.element.clean();
        if (props) {
            Object.entries(props).forEach(({ 0: name, 1: prop }) => __classPrivateFieldGet(this, _AunWidget__props, "f")[name] = prop);
        }
        this.content(this.children);
        return this;
    }
    /**
     * render
     * @description Rend le widget
     */
    render() {
        this.element.className(this.construct.appearance.uid);
        this.construct.make(this, this.children);
        return this;
    }
    /**
     * remove
     * @description Détruit le widget
     */
    remove() {
        this.construct.appearance.destroy();
        this.element.instance.remove();
        this.emitter.dispatch('remove', undefined);
        return this;
    }
    /**
     * timeOut
     * @description Execute une fonction après un temps donnée
     * @param callback Fonction de rappel retournant un widget et le timer
     * @param time Durée du compte à rebour
     * @example
     * widget.timeOut( ( widget, timer ) => ... )
     */
    timeOut(callback, time) {
        let timer = undefined;
        const handler = () => timer ? callback(this, timer) : undefined;
        timer = setTimeout(handler, time || 500);
        return this;
    }
    /**
     * timeInterval
     * @description Execute une fonction à un interval de temps
     * @param callback Fonction de rappel retournant un widget et le timer
     * @param time Durée de l'interval
     * @example
     * widget.timeInterval( ( widget, timer ) => ... )
     */
    timeInterval(callback, time) {
        let timer = undefined;
        const handler = () => timer ? callback(this, timer) : undefined;
        timer = setInterval(handler, time || 500);
        return this;
    }
    /**
     * frameReady
     * @description Execute une fonction quand permet l'animation des frames
     * @param callback Fonction de rappel appelent un widget en argument
     * @example
     * widget.frameReady( widget => ... )
     */
    frameReady(callback) {
        requestAnimationFrame(() => callback(this));
        return this;
    }
}
_AunWidget__props = new WeakMap(), _AunWidget_instances = new WeakSet(), _AunWidget_excavation = function _AunWidget_excavation(props) {
    Object.entries(props).forEach(({ 0: key, 1: value }) => {
        if (key == 'children') {
            this.children = value;
        }
        else {
            __classPrivateFieldSet(this, _AunWidget__props, value, "f");
        }
    });
    this.emitter.dispatch('excavation', this);
    return this;
};
/**
 * Protorian Construct
 * @description Constructeur de Widget
 */
export class AunConstruct {
    constructor() {
        /**
         * Emetteur
         */
        this.emitter = new AunEmitter();
        /**
         * Apparence
         */
        this.appearance = new AunAppearance();
        this.appearance.emitter.listen('sync', appear => {
            this.emitter.dispatch('appearance', appear);
        });
        this.appearance.mount();
    }
    /**
     * make
     * @description Créer le constructeur
     * @param root Racine Widget
     * @param children Enfants à ajouter
     */
    make(root, children) {
        this.emitter.dispatch('before', root);
        root.emitter.dispatch('beforeRendering', children);
        this.makeChildren(root, children);
        root.emitter.dispatch('afterRendering', children);
        this.emitter.dispatch('after', root);
        root.emitter.dispatch('ready', root);
        return root;
    }
    /**
     * makeChildren
     * @description Construire les enfants
     * @param root Racine Widget
     * @param children Enfants à ajouter
     */
    makeChildren(root, children) {
        if (children instanceof Element) {
            root.element.instance.append(children);
            root.emitter.dispatch('elementAdded', children);
            root.emitter.dispatch('childAdded', children);
        }
        else if (children instanceof AunState) {
            children.records(root);
            root.emitter.dispatch('stateAdded', children);
            root.emitter.dispatch('childAdded', children);
        }
        else if (typeof children == 'string' ||
            typeof children == 'boolean' ||
            typeof children == 'number') {
            root.element.instance.innerHTML = (`${children}`);
            root.emitter.dispatch('htmlAdded', children);
            root.emitter.dispatch('childAdded', children);
        }
        else if (children instanceof AunWidget) {
            root.element.instance.append(children.element.instance);
            root.emitter.dispatch('widgetAdded', children);
            root.emitter.dispatch('childAdded', children);
            children.emitter.dispatch('ready', children);
        }
        else if (Array.isArray(children)) {
            children.forEach(child => this.make(root, child));
        }
        if (children instanceof Promise) {
            const anchor = document.createTextNode('');
            root.element.instance.append(anchor);
            children.then(component => {
                root.element.instance.replaceChild(component.element.instance, anchor);
                root.emitter.dispatch('promiseAdded', children);
                root.emitter.dispatch('childAdded', children);
            }).catch(er => {
                throw (`AunConstruct : ${JSON.stringify(er)}`);
            });
        }
        return root;
    }
    /**
     * makeAppearance
     * @description Construire l'apparence
     * @param root
     * @param payload
     */
    makeAppearance(root, payload) {
        this.appearance.set(payload);
        return root;
    }
}
export class AunView {
    constructor(componentConstructor, options) {
        _AunView__parameters.set(this, {});
        _AunView__component.set(this, undefined);
        this.componentConstructor = componentConstructor;
        this.options = options || {};
    }
    get parameters() { return __classPrivateFieldGet(this, _AunView__parameters, "f"); }
    get component() { return __classPrivateFieldGet(this, _AunView__component, "f"); }
    show(parameters) {
        __classPrivateFieldSet(this, _AunView__parameters, parameters, "f");
        this.component?.element.removeStyle('display');
        return this;
    }
    hide() {
        this.component?.element.style({ display: 'none' });
        return this;
    }
    refresh(parameters) {
        // Mise à jour des paramètre
        __classPrivateFieldSet(this, _AunView__parameters, UpdateObject(__classPrivateFieldGet(this, _AunView__parameters, "f"), parameters), "f");
        // Reconstruit le composant
        const render = this.render();
        // Remplacement basket
        this.component?.element.instance.parentNode?.replaceChild(render.element.instance, this.component?.element.instance);
        return this;
    }
    render() {
        __classPrivateFieldSet(this, _AunView__component, this.componentConstructor(this.parameters), "f");
        return __classPrivateFieldGet(this, _AunView__component, "f");
    }
}
_AunView__parameters = new WeakMap(), _AunView__component = new WeakMap();
export class AunStackViews {
    constructor(views, options) {
        _AunStackViews_views.set(this, {});
        /**
         * Options
         */
        this.options = {};
        /**
         * Système de navigation
         */
        this.navigation = new AunNavigation();
        this.emitter = new AunEmitter();
        __classPrivateFieldSet(this, _AunStackViews_views, views, "f");
        this.options = options || {};
        this.navigation.setOptions({
            middlewares: [
                this.middleware.bind(this),
            ],
            useHashtagParser: (typeof this.options.useHashtagParser != 'undefined')
                ? this.options.useHashtagParser
                : true,
            capture: (typeof this.options.capture != 'undefined')
                ? this.options.capture
                : true,
        });
    }
    /**
     * Les vues
     */
    get views() { return __classPrivateFieldGet(this, _AunStackViews_views, "f"); }
    middleware({ args, routeName }) {
        const view = __classPrivateFieldGet(this, _AunStackViews_views, "f")[routeName] || undefined;
        if (view && this.options.canvas) {
            fe(this.options.canvas, canvas => {
                canvas.innerText = '';
                const component = view.componentConstructor(args);
                canvas.append(component.element.instance);
                console.log('Middleware called', routeName, component, canvas);
            });
        }
        else {
            this.emitter.dispatch('error', routeName);
        }
        return this;
    }
    /**
     * Démarrage
     */
    run() {
        this.navigation.observe();
        if (this.options.index) {
            this.navigation.navigate(this.navigation.currentRoute() || this.options.index, this.navigation.currentQuery() || undefined, undefined);
        }
        return this;
    }
}
_AunStackViews_views = new WeakMap();
/**
 * Système de navigation
 */
export class AunNavigation {
    constructor() {
        this.options = {};
        this.emitter = new AunEmitter();
        this.options.middlewares = this.options.middlewares || [];
    }
    currentRoute() {
        return (this.options.useHashtagParser ? location.hash : location.pathname).substring(1);
    }
    currentQuery() {
        return URLParamsObject(location.search);
    }
    setOptions(options) {
        this.options = UpdateObject(this.options, options);
        this.emitter.dispatch('options', this);
        return this;
    }
    middleware(middleware) {
        this.options.middlewares?.push(middleware);
        return this;
    }
    observe() {
        window.addEventListener('popstate', ev => this.dispatchNavigate(ev));
        this.capturesActions();
        return this;
    }
    capturesActions() {
        if (this.options.capture) {
            document.body.addEventListener('click', (ev) => {
                const target = this.parseElementCaptured(ev);
                if (target && !target.hasAttribute('navigate:no-detection')) {
                    const url = target.getAttribute('href') || target.getAttribute('navigate:view');
                    const blank = (target.getAttribute('target') || '').toLowerCase() == '_blank';
                    const external = url ? this.isExternalURL(url) : false;
                    if (url && !blank && !external) {
                        ev.preventDefault();
                        this.navigate(this.parseRouteName(url), {}, ev);
                    }
                }
            }, false);
        }
        return this;
    }
    parseRouteName(routeName) {
        const route = routeName.trim();
        const firstChar = route.substring(0, 1);
        return (firstChar == '/' || firstChar == '#') ? route.substring(1) : route;
    }
    isExternalURL(url) {
        return (url.match(/^http/gi) || url.match(/^\/\//gi)) ? true : false;
    }
    parseElementCaptured(ev) {
        if (ev.target instanceof HTMLElement) {
            return AscendingDOMPath(ev.target, parent => parent.tagName == 'A' ? true : false);
        }
        return undefined;
    }
    dispatchNavigate(ev) {
        const routeName = this.currentRoute();
        const parser = this.options.useHashtagParser ? 'hashtag' : 'directory';
        this.options.middlewares?.forEach(middleware => middleware({
            navigation: this,
            event: ev,
            routeName: this.currentRoute(),
            args: this.currentQuery() || undefined,
            parser: this.options.useHashtagParser ? 'hashtag' : 'directory',
        }));
        this.emitter.dispatch('navigate', {
            navigation: this,
            routeName,
            parser: parser,
        });
        return this;
    }
    navigate(route, props, ev) {
        if (!route) {
            return this;
        }
        const currentRoute = this.currentRoute();
        const routeName = route;
        if (currentRoute != routeName) {
            if (this.options.useHashtagParser) {
                location.hash = `${routeName}`;
            }
            else {
                history.pushState(props || {}, document.title, `${routeName}`);
                this.dispatchNavigate(ev || undefined);
            }
        }
        else {
            this.dispatchNavigate(ev || undefined);
        }
        return this;
    }
}
export class AunViewSwitcher {
}

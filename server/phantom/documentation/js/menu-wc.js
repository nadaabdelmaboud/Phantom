'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">phantom documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-89771e8cbe097f4e6273b959b75d2f66"' : 'data-target="#xs-controllers-links-module-AppModule-89771e8cbe097f4e6273b959b75d2f66"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-89771e8cbe097f4e6273b959b75d2f66"' :
                                            'id="xs-controllers-links-module-AppModule-89771e8cbe097f4e6273b959b75d2f66"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-89771e8cbe097f4e6273b959b75d2f66"' : 'data-target="#xs-injectables-links-module-AppModule-89771e8cbe097f4e6273b959b75d2f66"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-89771e8cbe097f4e6273b959b75d2f66"' :
                                        'id="xs-injectables-links-module-AppModule-89771e8cbe097f4e6273b959b75d2f66"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link">AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-120d21e0712bf583c8a4a5aa574dc1b5"' : 'data-target="#xs-controllers-links-module-AuthModule-120d21e0712bf583c8a4a5aa574dc1b5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-120d21e0712bf583c8a4a5aa574dc1b5"' :
                                            'id="xs-controllers-links-module-AuthModule-120d21e0712bf583c8a4a5aa574dc1b5"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-120d21e0712bf583c8a4a5aa574dc1b5"' : 'data-target="#xs-injectables-links-module-AuthModule-120d21e0712bf583c8a4a5aa574dc1b5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-120d21e0712bf583c8a4a5aa574dc1b5"' :
                                        'id="xs-injectables-links-module-AuthModule-120d21e0712bf583c8a4a5aa574dc1b5"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GoogleStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>GoogleStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/BoardModule.html" data-type="entity-link">BoardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-BoardModule-c816b00656ad521bd1190a7fcce8d714"' : 'data-target="#xs-controllers-links-module-BoardModule-c816b00656ad521bd1190a7fcce8d714"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-BoardModule-c816b00656ad521bd1190a7fcce8d714"' :
                                            'id="xs-controllers-links-module-BoardModule-c816b00656ad521bd1190a7fcce8d714"' }>
                                            <li class="link">
                                                <a href="controllers/BoardController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BoardController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-BoardModule-c816b00656ad521bd1190a7fcce8d714"' : 'data-target="#xs-injectables-links-module-BoardModule-c816b00656ad521bd1190a7fcce8d714"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BoardModule-c816b00656ad521bd1190a7fcce8d714"' :
                                        'id="xs-injectables-links-module-BoardModule-c816b00656ad521bd1190a7fcce8d714"' }>
                                        <li class="link">
                                            <a href="injectables/BoardService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>BoardService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ChatModule.html" data-type="entity-link">ChatModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ChatModule-afedd6a72b49d8ad4c1341ac6da826e1"' : 'data-target="#xs-controllers-links-module-ChatModule-afedd6a72b49d8ad4c1341ac6da826e1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ChatModule-afedd6a72b49d8ad4c1341ac6da826e1"' :
                                            'id="xs-controllers-links-module-ChatModule-afedd6a72b49d8ad4c1341ac6da826e1"' }>
                                            <li class="link">
                                                <a href="controllers/ChatController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ChatController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ChatModule-afedd6a72b49d8ad4c1341ac6da826e1"' : 'data-target="#xs-injectables-links-module-ChatModule-afedd6a72b49d8ad4c1341ac6da826e1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ChatModule-afedd6a72b49d8ad4c1341ac6da826e1"' :
                                        'id="xs-injectables-links-module-ChatModule-afedd6a72b49d8ad4c1341ac6da826e1"' }>
                                        <li class="link">
                                            <a href="injectables/ChatService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ChatService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ImagesModule.html" data-type="entity-link">ImagesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ImagesModule-0db0a590bab8efb94e1f41ad6fbe7b05"' : 'data-target="#xs-controllers-links-module-ImagesModule-0db0a590bab8efb94e1f41ad6fbe7b05"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ImagesModule-0db0a590bab8efb94e1f41ad6fbe7b05"' :
                                            'id="xs-controllers-links-module-ImagesModule-0db0a590bab8efb94e1f41ad6fbe7b05"' }>
                                            <li class="link">
                                                <a href="controllers/ImagesController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ImagesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ImagesModule-0db0a590bab8efb94e1f41ad6fbe7b05"' : 'data-target="#xs-injectables-links-module-ImagesModule-0db0a590bab8efb94e1f41ad6fbe7b05"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ImagesModule-0db0a590bab8efb94e1f41ad6fbe7b05"' :
                                        'id="xs-injectables-links-module-ImagesModule-0db0a590bab8efb94e1f41ad6fbe7b05"' }>
                                        <li class="link">
                                            <a href="injectables/GridFsMulterConfigService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>GridFsMulterConfigService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ImagesService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ImagesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PinsModule.html" data-type="entity-link">PinsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-PinsModule-2a0e4e7fa7070b181ace7a19c43799a1"' : 'data-target="#xs-controllers-links-module-PinsModule-2a0e4e7fa7070b181ace7a19c43799a1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PinsModule-2a0e4e7fa7070b181ace7a19c43799a1"' :
                                            'id="xs-controllers-links-module-PinsModule-2a0e4e7fa7070b181ace7a19c43799a1"' }>
                                            <li class="link">
                                                <a href="controllers/PinsController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PinsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PinsModule-2a0e4e7fa7070b181ace7a19c43799a1"' : 'data-target="#xs-injectables-links-module-PinsModule-2a0e4e7fa7070b181ace7a19c43799a1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PinsModule-2a0e4e7fa7070b181ace7a19c43799a1"' :
                                        'id="xs-injectables-links-module-PinsModule-2a0e4e7fa7070b181ace7a19c43799a1"' }>
                                        <li class="link">
                                            <a href="injectables/PinsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>PinsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RecommendationModule.html" data-type="entity-link">RecommendationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-RecommendationModule-3694f06cb9369ea18214a0cdb6e39ea2"' : 'data-target="#xs-controllers-links-module-RecommendationModule-3694f06cb9369ea18214a0cdb6e39ea2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RecommendationModule-3694f06cb9369ea18214a0cdb6e39ea2"' :
                                            'id="xs-controllers-links-module-RecommendationModule-3694f06cb9369ea18214a0cdb6e39ea2"' }>
                                            <li class="link">
                                                <a href="controllers/RecommendationController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RecommendationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RecommendationModule-3694f06cb9369ea18214a0cdb6e39ea2"' : 'data-target="#xs-injectables-links-module-RecommendationModule-3694f06cb9369ea18214a0cdb6e39ea2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RecommendationModule-3694f06cb9369ea18214a0cdb6e39ea2"' :
                                        'id="xs-injectables-links-module-RecommendationModule-3694f06cb9369ea18214a0cdb6e39ea2"' }>
                                        <li class="link">
                                            <a href="injectables/RecommendationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RecommendationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SearchModule.html" data-type="entity-link">SearchModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-SearchModule-46f0fce453cb431e31a634ccc26ce125"' : 'data-target="#xs-controllers-links-module-SearchModule-46f0fce453cb431e31a634ccc26ce125"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SearchModule-46f0fce453cb431e31a634ccc26ce125"' :
                                            'id="xs-controllers-links-module-SearchModule-46f0fce453cb431e31a634ccc26ce125"' }>
                                            <li class="link">
                                                <a href="controllers/SearchController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SearchController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SearchModule-46f0fce453cb431e31a634ccc26ce125"' : 'data-target="#xs-injectables-links-module-SearchModule-46f0fce453cb431e31a634ccc26ce125"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SearchModule-46f0fce453cb431e31a634ccc26ce125"' :
                                        'id="xs-injectables-links-module-SearchModule-46f0fce453cb431e31a634ccc26ce125"' }>
                                        <li class="link">
                                            <a href="injectables/SearchService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SearchService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SharedModule-6d1d88eb3e8e07aed497228077f61255"' : 'data-target="#xs-injectables-links-module-SharedModule-6d1d88eb3e8e07aed497228077f61255"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SharedModule-6d1d88eb3e8e07aed497228077f61255"' :
                                        'id="xs-injectables-links-module-SharedModule-6d1d88eb3e8e07aed497228077f61255"' }>
                                        <li class="link">
                                            <a href="injectables/ChatService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ChatService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/Email.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>Email</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/NotificationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>NotificationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ValidationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ValidationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TopicModule.html" data-type="entity-link">TopicModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-TopicModule-25e665ee9261f9589fa2184912b81275"' : 'data-target="#xs-controllers-links-module-TopicModule-25e665ee9261f9589fa2184912b81275"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TopicModule-25e665ee9261f9589fa2184912b81275"' :
                                            'id="xs-controllers-links-module-TopicModule-25e665ee9261f9589fa2184912b81275"' }>
                                            <li class="link">
                                                <a href="controllers/TopicController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TopicController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-TopicModule-25e665ee9261f9589fa2184912b81275"' : 'data-target="#xs-injectables-links-module-TopicModule-25e665ee9261f9589fa2184912b81275"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TopicModule-25e665ee9261f9589fa2184912b81275"' :
                                        'id="xs-injectables-links-module-TopicModule-25e665ee9261f9589fa2184912b81275"' }>
                                        <li class="link">
                                            <a href="injectables/TopicService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TopicService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link">UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UserModule-09f852ab7c73143264a367fbd4b9f6c9"' : 'data-target="#xs-controllers-links-module-UserModule-09f852ab7c73143264a367fbd4b9f6c9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-09f852ab7c73143264a367fbd4b9f6c9"' :
                                            'id="xs-controllers-links-module-UserModule-09f852ab7c73143264a367fbd4b9f6c9"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-09f852ab7c73143264a367fbd4b9f6c9"' : 'data-target="#xs-injectables-links-module-UserModule-09f852ab7c73143264a367fbd4b9f6c9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-09f852ab7c73143264a367fbd4b9f6c9"' :
                                        'id="xs-injectables-links-module-UserModule-09f852ab7c73143264a367fbd4b9f6c9"' }>
                                        <li class="link">
                                            <a href="injectables/UserService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#controllers-links"' :
                                'data-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link">AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link">AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/BoardController.html" data-type="entity-link">BoardController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ChatController.html" data-type="entity-link">ChatController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ImagesController.html" data-type="entity-link">ImagesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PinsController.html" data-type="entity-link">PinsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RecommendationController.html" data-type="entity-link">RecommendationController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/SearchController.html" data-type="entity-link">SearchController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TopicController.html" data-type="entity-link">TopicController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserController.html" data-type="entity-link">UserController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CreatePinDto.html" data-type="entity-link">CreatePinDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditBoardDto.html" data-type="entity-link">EditBoardDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EditCollaboratoresPermissionsDto.html" data-type="entity-link">EditCollaboratoresPermissionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileInfoVm.html" data-type="entity-link">FileInfoVm</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileResponseVm.html" data-type="entity-link">FileResponseVm</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpExceptionFilter.html" data-type="entity-link">HttpExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/SharedGateway.html" data-type="entity-link">SharedGateway</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link">AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BoardService.html" data-type="entity-link">BoardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChatService.html" data-type="entity-link">ChatService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/Email.html" data-type="entity-link">Email</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GoogleStrategy.html" data-type="entity-link">GoogleStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GridFsMulterConfigService.html" data-type="entity-link">GridFsMulterConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ImagesService.html" data-type="entity-link">ImagesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link">JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoggingInterceptor.html" data-type="entity-link">LoggingInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationService.html" data-type="entity-link">NotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PinsService.html" data-type="entity-link">PinsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RecommendationService.html" data-type="entity-link">RecommendationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SearchService.html" data-type="entity-link">SearchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TopicService.html" data-type="entity-link">TopicService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link">UserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ValidationService.html" data-type="entity-link">ValidationService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/board.html" data-type="entity-link">board</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/chat.html" data-type="entity-link">chat</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/comment.html" data-type="entity-link">comment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginDto.html" data-type="entity-link">LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/message.html" data-type="entity-link">message</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Payload.html" data-type="entity-link">Payload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/pin.html" data-type="entity-link">pin</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterDto.html" data-type="entity-link">RegisterDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/reply.html" data-type="entity-link">reply</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/section.html" data-type="entity-link">section</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/topic.html" data-type="entity-link">topic</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateDto.html" data-type="entity-link">UpdateDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateSettingsDto.html" data-type="entity-link">UpdateSettingsDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/user.html" data-type="entity-link">user</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
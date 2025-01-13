// 1. Внешние зависимости.
// 2. Компоненты вашего проекта.
// 3. Утилиты и бизнес-логика.
// 4. Стили и ассеты.
import './activity.scss';

const Activity = () => <div className="Activity innerContainer">
    
    <div className="layout has-sidebar fixed-sidebar fixed-header">
      <aside id="sidebar" className="sidebar break-point-sm has-bg-image">
        <div className="sidebar-layout">

          <div className="sidebar-content">
            <nav className="menu open-current-submenu">
              <ul>
                {/* <li className="menu-header"><span> ABILITIES </span></li>
                <li className="menu-item sub-menu">
                  <a href="#">
                    <span className="menu-icon">
                      <i className="ri-vip-diamond-fill"></i>
                    </span>
                    <span className="menu-title">Components</span>
                    <span className="menu-suffix">
                      <span className="badge primary">Hot</span>
                    </span>
                  </a>
                  <div className="sub-menu-list">
                    <ul>
                      <li className="menu-item">
                        <a href="#">
                          <span className="menu-title">Grid</span>
                        </a>
                      </li>
                      <li className="menu-item">
                        <a href="#">
                          <span className="menu-title">Layout</span>
                        </a>
                      </li>
                      <li className="menu-item sub-menu">
                        <a href="#">
                          <span className="menu-title">Forms</span>
                        </a>
                        <div className="sub-menu-list">
                          <ul>
                            <li className="menu-item">
                              <a href="#">
                                <span className="menu-title">Input</span>
                              </a>
                            </li>
                            <li className="menu-item">
                              <a href="#">
                                <span className="menu-title">Select</span>
                              </a>
                            </li>
                            <li className="menu-item sub-menu">
                              <a href="#">
                                <span className="menu-title">More</span>
                              </a>
                              <div className="sub-menu-list">
                                <ul>
                                  <li className="menu-item">
                                    <a href="#">
                                      <span className="menu-title">CheckBox</span>
                                    </a>
                                  </li>
                                  <li className="menu-item">
                                    <a href="#">
                                      <span className="menu-title">Radio</span>
                                    </a>
                                  </li>
                                  <li className="menu-item sub-menu">
                                    <a href="#">
                                      <span className="menu-title">Want more ?</span>
                                      <span className="menu-suffix">&#x1F914;</span>
                                    </a>
                                    <div className="sub-menu-list">
                                      <ul>
                                        <li className="menu-item">
                                          <a href="#">
                                            <span className="menu-prefix">&#127881;</span>
                                            <span className="menu-title">You made it </span>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="menu-item sub-menu">
                  <a href="#">
                    <span className="menu-icon">
                      <i className="ri-bar-chart-2-fill"></i>
                    </span>
                    <span className="menu-title">Charts</span>
                  </a>
                  <div className="sub-menu-list">
                    <ul>
                      <li className="menu-item">
                        <a href="#">
                          <span className="menu-title">Pie chart</span>
                        </a>
                      </li>
                      <li className="menu-item">
                        <a href="#">
                          <span className="menu-title">Line chart</span>
                        </a>
                      </li>
                      <li className="menu-item">
                        <a href="#">
                          <span className="menu-title">Bar chart</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="menu-item sub-menu">
                  <a href="#">
                    <span className="menu-icon">
                      <i className="ri-shopping-cart-fill"></i>
                    </span>
                    <span className="menu-title">E-commerce</span>
                  </a>
                  <div className="sub-menu-list">
                    <ul>
                      <li className="menu-item">
                        <a href="#">
                          <span className="menu-title">Products</span>
                        </a>
                      </li>
                      <li className="menu-item">
                        <a href="#">
                          <span className="menu-title">Orders</span>
                        </a>
                      </li>
                      <li className="menu-item">
                        <a href="#">
                          <span className="menu-title">credit card</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="menu-item sub-menu">
                  <a href="#">
                    <span className="menu-icon">
                      <i className="ri-global-fill"></i>
                    </span>
                    <span className="menu-title">Maps</span>
                  </a>
                  <div className="sub-menu-list">
                    <ul>
                      <li className="menu-item">
                        <a href="#">
                          <span className="menu-title">Google maps</span>
                        </a>
                      </li>
                      <li className="menu-item">
                        <a href="#">
                          <span className="menu-title">Open street map</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="menu-item sub-menu">
                  <a href="#">
                    <span className="menu-icon">
                     <i className="ri-paint-brush-fill"></i>
                    </span>
                    <span className="menu-title">Theme</span>
                  </a>
                  <div className="sub-menu-list">
                    <ul>
                      <li className="menu-item">
                        <a href="#">
                          <span className="menu-title">Dark</span>
                        </a>
                      </li>
                      <li className="menu-item">
                        <a href="#">
                          <span className="menu-title">Light</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="menu-header" style={{paddingTop: '20px'}}><span> ARTIFACTS </span></li>
                <li className="menu-item">
                  <a href="#">
                    <span className="menu-icon">
                      <i className="ri-book-2-fill"></i>
                    </span>
                    <span className="menu-title">Documentation</span>
                    <span className="menu-suffix">
                      <span className="badge secondary">Beta</span>
                    </span>
                  </a>
                </li>
                <li className="menu-item">
                  <a href="#">
                    <span className="menu-icon">
                      <i className="ri-calendar-fill"></i>
                    </span>
                    <span className="menu-title">Calendar</span>
                  </a>
                </li>
                <li className="menu-item">
                  <a href="#">
                    <span className="menu-icon">
                      <i className="ri-service-fill"></i>
                    </span>
                    <span className="menu-title">Examples</span>
                  </a>
                </li> */}
                <li className="Menu__item">
                  <div className="Menu__tile img-abilities">
                    <span>ABILITIES</span>
                  </div>
                </li>
                <li className="Menu__item">
                  <div className="Menu__tile img-items">
                    <span>ITEMS</span>
                  </div>
                </li>
                <li className="Menu__item">
                  <div className="Menu__tile img-other">
                    <span>OTHER</span>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
          {/* <div className="sidebar-footer">
            <div className="footer-box">
              <div>
                <img
                  className="react-logo"
                  src="https://user-images.githubusercontent.com/25878302/213938106-ca8f0485-3f30-4861-9188-2920ed7ab284.png"
                  alt="react"
                />
              </div>
              <div style={{padding: '0 10px'}}>
                <span style={{display: 'block', marginBottom: '10px'}}
                  >Pro sidebar is also available as a react package
                </span>
                <div style={{marginBottom: '10px'}}>
                  <img
                    alt="preview badge"
                    src="https://img.shields.io/github/stars/azouaoui-med/react-pro-sidebar?style=social"
                  />
                </div>
                <div>
                  <a href="https://github.com/azouaoui-med/react-pro-sidebar" target="_blank">Check it out!</a>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </aside>
    </div>

    <div className="overlay">
      <div className="overlay__workspace"></div>
    </div>

    <div className="Activity__container">
      <div className="Activity__time">
        00:00
      </div>
      <div className="Activity__grid">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
</div>

export default Activity;
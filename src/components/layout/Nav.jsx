import React, { Component } from 'react'
import classnames from 'classnames'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import VelcroLogo from '~/assets/images/velcro--logo.svg'
import VelcroVSymbol from '~/assets/images/velcro--v-symbol.svg'
import * as routes from '~/../config/routes'

export const Nav = class _Nav extends Component {
  state = {
    mobileNavActive: false
  }

  handleToggleMobileNav = (e) => {
    const mobileNavActive = !this.state.mobileNavActive

    this.setState({ mobileNavActive })
  }

  closeMobileNav = (e) => {
    this.setState({ mobileNavActive: false })
  }

  render () {
    return (
      <>
        <div
          className={classnames('nav-background no-select', { 'is-active': this.state.mobileNavActive })}
          onClick={this.closeMobileNav}
        />

        <nav className='navbar'>
          <div className='container'>
            <div className='row navbar-menu-container'>
              <div className='navbar-brand col-xs-8 col-md-8'>
                <Link to={routes.HOME} className='navbar-item'>
                  <VelcroVSymbol className='v-symbol' /> <VelcroLogo />
                </Link>
              </div>

              <div className='col-xs-4 is-hidden-tablet has-text-right'>
                <button
                  className={classnames(
                    'burger',
                    'burger-slip',
                    { 'open': this.state.mobileNavActive }
                  )}
                  data-target='navbar-menu'
                  onClick={this.handleToggleMobileNav}
                >
                  <div className='burger-lines' />
                </button>
              </div>

              <div id='navbar-menu' className={classnames(
                'navbar-menu',
                'col-xs-4',
                'col-md-4',
                { 'is-active': this.state.mobileNavActive }
              )}>
                <div className='navbar-end'>
                  <a
                    href='/#your-webhooks'
                    className='navbar-item'
                  >
                    Hooks
                  </a>
                </div>
              </div>
            </div>

          </div>
        </nav>
      </>
    )
  }
}

export const NavContainer = withRouter(Nav)

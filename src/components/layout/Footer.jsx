import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import VelcroLogo from '~/assets/images/velcro--logo.svg'
import VelcroVSymbol from '~/assets/images/velcro--v-symbol.svg'
import * as routes from '~/../config/routes'

export const Footer = class _Footer extends Component {
  render () {
    const year = new Date().getFullYear()
    return (
      <>
        <footer className='footer has-text-centered'>
          <div className='footer--primary'>
            <div className='footer-menu'>
              <a
                href='/#your-webhooks'
                className='footer-item is-uppercase has-text-weight-bold'
              >
                Hooks
              </a>
            </div>
          </div>

          <div className='footer--secondary'>
            <div className='footer-brand'>
              <div className='footer-item'>
                <h6 className='is-size-6'>
                  <VelcroVSymbol className='v-symbol--light' />
                  <VelcroLogo />
                </h6>
                <br />
                Velcro is an open source project which you can run your own instance of. Learn more on GitHub: 
                <br />
                <a 
                  href='https://github.com/ethvelcro'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Visit Velcro on GitHub
                </a>
                <br />
                <br />
              </div>
            </div>

            <br />

            <span
              className='footer-item footer-item--copyright'
            >
              &copy; {year} <a
                href='https://delta.camp'
                target='_blank'
                rel='noopener noreferrer'
              >Delta Camp</a> &amp; <a
                href='https://twitter.com/jacque006'
                target='_blank'
                rel='noopener noreferrer'
              >Jake Caban-Tomski</a>
            </span>
          </div>
        </footer>
      </>
    )
  }
}

export const FooterContainer = withRouter(Footer)

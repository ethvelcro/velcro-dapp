import React, { PureComponent } from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { allowedNetworkIds } from '~/web3/allowedNetworkIds'
import { FooterContainer } from '~/components/layout/Footer'
import { ErrorMessage } from '~/components/ErrorMessage'
import { HooksList } from '~/components/hooks/HooksList'
import { LandingHero } from '~/components/hooks/LandingHero'
import { CodeBox } from '~/components/CodeBox'
import { web3Queries } from '~/queries/web3Queries'
import * as routes from '~/../config/routes'

export class HomePage extends PureComponent {
  render () {
    const heroColor = 'is-link'

    return (
      <div className='is-positioned-absolutely'>
        <LandingHero heroColor={heroColor} />
        
        <section className='section section--main-content'>
          <div className='container'>
            <div className='row'>
              <div className='col-xs-12 col-lg-6'>
                {/* <CodeBox /> */}
                {/* <p>
                  <a href='https://docs.zeppelinos.org' target='_blank' rel='noopener noreferrer'>See Hook Docs &gt;</a>
                </p> */}
                <Query query={web3Queries.networkIdQuery}>
                  {({ data }) => {
                    const wrongNetwork = data && data.networkId && allowedNetworkIds().indexOf(data.networkId) === -1

                    if (wrongNetwork) {
                      return <ErrorMessage errorMessage={
                        `No hooks available on the currently selected Ethereum network.`
                      } />
                    } else {
                      return (
                        <>
                          <h5 className='is-size-5 has-text-grey-dark is-uppercase has-text-weight-bold'>
                            Example Hooks
                          </h5>
                          <br />

                          <div className='message-white has-text-centered'>
                            <div className='message-white--body'>
                              <p className='message-body--text has-text-grey'>
                                Want to start receiving notifications?
                              </p>
                              <Link
                                className='button is-primary'
                                to={routes.HOOKS}
                              >
                                Create Your First Hook
                              </Link>
                            </div>
                          </div>

                          <HooksList location={this.props.location} />
                        </>
                      )
                    }
                  }}
                </Query>
              </div>
            </div>
          </div>
        </section>

        <FooterContainer />
      </div>
    )
  }
}

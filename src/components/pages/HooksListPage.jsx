import React, { PureComponent } from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { allowedNetworkIds } from '~/web3/allowedNetworkIds'
import { CreateHookForm } from '~/components/hooks/CreateHookForm'
import { FooterContainer } from '~/components/layout/Footer'
import { ErrorMessage } from '~/components/ErrorMessage'
import { HooksList } from '~/components/hooks/HooksList'
import { CodeBox } from '~/components/CodeBox'
import { web3Queries } from '~/queries/web3Queries'
import * as routes from '~/../config/routes'

export class HooksListPage extends PureComponent {
  render () {
    const heroColor = 'is-link'

    return (
      <div className='is-positioned-absolutely'>
        <section className='section section--main-content has-bg'>
          <div className='container'>
            <div className='row'>
              <div className='col-xs-12'>
                <h1 className='is-size-1 has-text-grey-dark is-uppercase has-text-weight-bold has-text-centered'>
                  Create Hook:
                </h1>
                <br />

                <CreateHookForm />

                {/* <CodeBox /> */}
                {/* <p>
                  <a href='https://docs.zeppelinos.org' target='_blank' rel='noopener noreferrer'>See Hook Docs &gt;</a>
                </p> */}
                <h5 className='is-size-5 has-text-grey-dark is-uppercase has-text-weight-bold'>
                  Your Hooks
                </h5>
                <br />

                <Query query={web3Queries.networkIdQuery}>
                  {({ data }) => {
                    const wrongNetwork = data && data.networkId && allowedNetworkIds().indexOf(data.networkId) === -1

                    if (wrongNetwork) {
                      return <ErrorMessage errorMessage={
                        `No hooks available on the currently selected Ethereum network.`
                      } />
                    } else {
                      return <HooksList location={this.props.location} />
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

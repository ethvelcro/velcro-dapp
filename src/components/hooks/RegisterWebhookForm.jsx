import React, { PureComponent } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
// import Helmet from 'react-helmet'
import Switch from 'react-bulma-switch'
import { CSSTransition } from 'react-transition-group'
import { graphql } from 'react-apollo'
// import { abiMapping } from '~/apollo/abiMapping'
import { ScrollToTop } from '~/components/ScrollToTop'
// import { FooterContainer } from '~/components/layout/Footer'
import { Web3Mutations } from '~/mutations/Web3Mutations'
import { transactionQueries } from '~/queries/transactionQueries'
import { web3Queries } from '~/queries/web3Queries'
// import { displayWeiToEther } from '~/utils/displayWeiToEther'
import { uploadWebhook } from '~/utils/uploadWebhook'

const ControlledSwitch = class extends PureComponent {
  render() {
    return <Switch
      rounded
      outlined
      color='info'
      size='medium'
      {...this.props}
      className='is-uppercase'
    />
  }
}

export const RegisterWebhookForm = graphql(Web3Mutations.sendTransaction, { name: 'sendTransaction' })(
  graphql(web3Queries.networkAccountQuery, { name: 'networkAccount' })(
    graphql(transactionQueries.allTransactionsQuery)(
      class _RegisterWebhookForm extends PureComponent {
        static contextTypes = {
          router: PropTypes.object.isRequired
        }

        constructor (props) {
          super(props)
          this.state = {
            webhookUrl: '',
            contractAddress: '',
            eventName: '',
            filterTopic1: '',
            filterTopic2: '',
            filterTopic3: '',
            filterEventBool: false,
            filterTopicsBool: false,
            isSendingTx: false,
            creationSuccessful: false
          }
        }

        async componentDidMount() {
          await uploadWebhook()
          console.log('done!')
        }

        hasSentTransaction() {
          return this.state.isSendingTx
        }

        registerWebhookTxError() {
          const hookTx = this.props.hookTx
          return !this.state.newHook && hookTx && !!hookTx.error
        }

        registerWebhookTxCompleted() {
          const hookTx = this.props.hookTx
          return !this.state.newHook && hookTx && hookTx.completed
        }

        helpText = () => {
          let text = ''

          if (this.needsWeb3()) {
            text = `You will need to`
          } else if (this.hasSentTransaction()) {
            text = 'Waiting for confirmation...'
          } else if (this.hasUncompletedTransaction()) {
            text = 'Waiting to receive transaction...'
          } else if (this.notLoggedIn()) {
            text = `You need to login to MetaMask`
          } else if (this.state.amountError) {
            text = 'Please enter an amount'
          } else if (this.registerWebhookTxError()) {
            text = 'Webhook was not registered'
          } else if (this.registerWebhookTxCompleted()) {
            text = 'Webhook registration successful'
          }

          return text
        }

        buttonText = () => {
          let text = 'Create!'

          if (this.registerWebhookTxError()) {
            text = 'Retry'
          } else if (this.registerWebhookTxCompleted()) {
            text = 'Done'
          }

          return text
        }

        isWarning() {
          return this.needsWeb3() && !this.hasUncompletedTransaction()
        }

        isDanger() {
          return this.state.amountError || this.registerWebhookTxError() || this.notLoggedIn()
        }

        isSuccess() {
          return this.registerWebhookTxCompleted() && !this.registerWebhookTxError()
        }

        isInputDisabled() {
          return this.hasUncompletedTransaction() || this.registerWebhookTxCompleted() || this.registerWebhookTxError() || this.notLoggedIn()
        }

        isButtonDisabled() {
          return this.hasUncompletedTransaction() || this.registerWebhookTxError() || this.notLoggedIn()
        }

        formClassName() {
          var className = ''

          if (this.hasUncompletedTransaction()) {
            className = 'tx-in-progress'
          } else if (this.isWarning()) {
            className = 'is-warning'
          } else if (this.isDanger()) {
            className = 'is-danger'
          } else if (this.isSuccess()) {
            className = 'is-success'
          }

          return className
        }

        helpClassName() {
          var className = ''

          if (this.hasUncompletedTransaction()) {
            className = 'has-text-link'
          } else if (this.isWarning()) {
            className = 'has-text-warning'
          } else if (this.isDanger()) {
            className = 'has-text-danger'
          } else if (this.isSuccess()) {
            className = 'has-text-success'
          }

          return className
        }

        registerWebhookTransaction() {
          /// wat?
          const ipfsHash = [
            this.state.contractAddress,
            this.state.webhookUrl
          ]

          const txData = {
            contractName: 'Velcro',
            method: 'registerWebhook',
            args: [
              ipfsHash
            ]
          }

          this.props.sendTransaction({
            variables: {
              txData
            }
          })
        }

        notLoggedIn() {
          const { networkAccount } = this.props
          let notLoggedIn = true
          if (networkAccount) {
            notLoggedIn = !networkAccount.account
          }
          return notLoggedIn
        }

        needsWeb3 = () => {
          const { systemInfo } = this.props
          return systemInfo && !systemInfo.hasWeb3Available
        }

        needsIOSWeb3 = () => {
          const { systemInfo } = this.props
          return systemInfo && systemInfo.mobileOS === 'iOS'
        }

        needsAndroidWeb3 = () => {
          const { systemInfo } = this.props
          return systemInfo && systemInfo.mobileOS === 'Android'
        }

        downloadText = () => {
          if (this.needsIOSWeb3()) {
            return 'Download Cipher Browser'
          } else if (this.needsAndroidWeb3()) {
            return 'Download Opera'
          } else {
            return 'Download MetaMask'
          }
        }

        downloadUrl = () => {
          if (this.needsIOSWeb3()) {
            return 'https://itunes.apple.com/us/app/cipher-browser-ethereum/id1294572970'
          } else if (this.needsAndroidWeb3()) {
            return 'https://play.google.com/store/apps/details?id=com.opera.browser'
          } else {
            return 'https://metamask.io/'
          }
        }

        downloadLink = () => {
          return this.needsWeb3() &&
            <a
              href={this.downloadUrl()}
              target='_blank'
              rel='noopener noreferrer'
              className='has-text-link'
            >{this.downloadText()}</a>
        }

        hasUncompletedTransaction() {
          return this.hasUncompletedRegisterWebhookTx()
        }

        hasUncompletedRegisterWebhookTx() {
          return this.props.registerWebhookTx && !this.props.registerWebhookTx.completed
        }

        handleSubmit = async () => {
          let hasError
          const requiredFields = ['webhookUrl', 'contractAddress']

          this.setState({ isLoading: true })

          requiredFields.forEach(field => {
            this.setState({
              [`${field}Error`]: false
            })
          })

          requiredFields.forEach(field => {
            if (this.state[field] === '') {
              this.setState({
                [`${field}Error`]: true
              })
              hasError = true
            }
          })

          if (hasError) {
            this.setState({ isLoading: false })
          } else {
            try {
              const ipfsHash = await uploadWebhook()
              console.log('done! ipfsHash is ', ipfsHash)







              // const web3 = newWeb3()
              // const accounts = await web3.eth.getAccounts()
              // const [owner] = accounts

              // const velcro = new web3.eth.Contract(velcroArtifact.abi, process.env.CONTRACT_ADDRESS)
              // const hex = web3.utils.toHex(ipfsHash)

              // const hashOwner = await velcro.methods.owner(hex).call()
              // if (hashOwner !== '0x0000000000000000000000000000000000000000') {
              //   await velcro.methods.unregisterWebhook(hex).send({
              //     from: owner
              //   })
              // }

              // const tx = await velcro.methods.registerWebhook(hex).send({ from: owner })
              // console.log(chalk.green(`TxResult: ${tx.txHash}`), tx)


              // if (this.registerWebhookTxError()) {
              //   this.resetForm()
              //   // this.focusOnInput()
              // } else {
              //   this.setState({ amountError: true })
              // }

              this.setState({ creationSuccessful: true })
            } catch (error) {
              console.error(error)
              this.setState({ errorMessage: error.message })
            } finally {
              this.setState({ isLoading: false })
            }
          }
        }

        render () {
          var content, error

          if (this.state.errorMessage) {
            error =
              <section className='hero is-medium is-dark has-text-centered first'>
                <ScrollToTop />
                <div className='hero-body'>
                  <h1 className='title'>
                    There was an error
                  </h1>
                  <h2 className='subtitle is-size-2'>
                    You can contact us directly at <a href='mailto:contact@delta.camp'>contact@delta.camp</a> for help
                  </h2>
                  <h5 className='is-size-5'>
                    {this.state.errorMessage}
                  </h5>
                </div>
              </section>
          }

          content =
            <form
              onSubmit={(e) => {
                e.preventDefault()
                this.handleSubmit()
              }}
              className={classnames('form', this.formClassName())}
            >
            <label htmlFor='contract-address-input' className='label is-size-4 is-uppercase has-text-grey'>
                I want to listen to events at this <span className='has-text-grey-darker'>contract address</span>: <span className='has-text-warning' style={{display: 'none'}}>*</span>
              </label>

              <div className='field'>
                <div className='control'>
                  <input
                    autoFocus
                    maxLength='42'
                    id='contract-address-input'
                    className='input'
                    type='text'
                    value={this.state.contractAddress}
                    onChange={(e) => this.setState({ contractAddress: e.target.value })}
                  />
                  {/* TODO: validate proper hex address! */}
                </div>

                {this.state.contractAddressError && (
                  <>
                    <ScrollToTop />
                    <label className='hint has-text-danger'>
                      Please enter a proper contract address to listen to
                    </label>
                  </>
                )}
              </div>

              <label htmlFor='webhook-url-input' className='label is-size-4 is-uppercase  has-text-grey'>
                When something happens please send a notification to this <span className='has-text-grey-darker'>URL</span>: <span className='has-text-warning' style={{ display: 'none' }}>*</span>
              </label>

              <div className='field'>
                <div className='control'>
                  <input
                    id='webhook-url-input'
                    className='input'
                    type='text'
                    value={this.state.webhookUrl}
                    onChange={(e) => this.setState({ webhookUrl: e.target.value })}
                  />
                  {/* TODO: validate proper url¿ */}
                </div>

                {this.state.webhookUrlError && (
                  <>
                    <ScrollToTop />
                    <label className='hint has-text-danger'>
                      Please enter a valid URL the server can POST JSON data to
                    </label>
                  </>
                )}
              </div>

              <hr />
              <br />
              <ControlledSwitch
                value={this.state.filterEventBool}
                onChange={(e) => {

                  this.setState({ filterEventBool: !this.state.filterEventBool })
                }} 
              >I would like to filter by a specific event</ControlledSwitch>

              <CSSTransition
                timeout={600}
                classNames='accordion'
                in={this.state.filterEventBool}
              >
                {state => (
                  <div className='accordion event-name-accordion'>
                    <div className='field'>
                      <div className='control'>
                        <label htmlFor='event-name-input' className='label is-size-4 is-uppercase'>
                          Contract Event name <span className='is-size-5 has-text-grey-light'>(ie. 'Register', 'Transfer', etc.)</span>
                        </label>

                        <input
                          id='event-name-input'
                          className='input'
                          type='text'
                          value={this.state.eventName}
                          onChange={(e) => this.setState({ eventName: e.target.value })}
                        />
                        {/* TODO: validate proper EVENT NAME! */}
                      </div>
                    </div>
                  </div>
                )}
              </CSSTransition>

              <hr />
              <br />
              <ControlledSwitch
                value={this.state.filterTopicsBool}
                onChange={(e) => {
                  this.setState({ filterTopicsBool: !this.state.filterTopicsBool })
                }}
              >
                I would like to filter by the following event topics:
              </ControlledSwitch>

              <CSSTransition
                timeout={600}
                classNames='accordion'
                in={this.state.filterTopicsBool}
              >
                {state => (
                  <div className='accordion event-topics-accordion'>
                    <div className='field'>
                      <div className='control'>
                        <label htmlFor='filter-topic-1-input' className='label is-size-4 is-uppercase'>
                          Event topic #1
                        </label>

                        <input
                          id='filter-topic-1-input'
                          className='input'
                          type='text'
                          value={this.state.filterTopic1}
                          onChange={(e) => this.setState({ filterTopic1: e.target.value })}
                        />
                        {/* TODO: validate proper EVENT TOPIC[0]! */}
                      </div>
                    </div>

                    <div className='field'>
                      <div className='control'>
                        <label htmlFor='filter-topic-2-input' className='label is-size-4 is-uppercase'>
                          Event topic #2
                          </label>

                        <input
                          id='filter-topic-2-input'
                          className='input'
                          type='text'
                          value={this.state.filterTopic2}
                          onChange={(e) => this.setState({ filterTopic2: e.target.value })}
                        />
                        {/* TODO: validate proper EVENT TOPIC[1]! */}
                      </div>
                    </div>

                    <div className='field'>
                      <div className='control'>
                        <label htmlFor='filter-topic-3-input' className='label is-size-4 is-uppercase'>
                          Event topic #3
                          </label>

                        <input
                          id='filter-topic-3-input'
                          className='input'
                          type='text'
                          value={this.state.filterTopic3}
                          onChange={(e) => this.setState({ filterTopic3: e.target.value })}
                        />
                        {/* TODO: validate proper EVENT TOPIC[0]! */}
                      </div>
                    </div>
                  </div>
                )}
              </CSSTransition>

              <div className='field'>
                <br />
                <br />

                <div className='control has-text-centered'>
                  <button
                    disabled={this.isButtonDisabled()}
                    className={classnames('button is-success', {
                      'is-loading': this.state.isLoading
                    })}
                  >
                    {this.buttonText()}
                  </button>
                </div>
              </div>

              <p className={classnames('help is-size-6', this.helpClassName())}>
                {this.helpText() || '\u00A0'} {this.downloadLink()}
              </p>
            </form>

          return (
            <>
              {error}

              <CSSTransition
                timeout={600}
                classNames='accordion'
                in={this.state.creationSuccessful}
              >
                {state => (
                  <div className='accordion'>
                    {this.state.creationSuccessful && <ScrollToTop />}

                    <div className='has-text-centered'>
                      <ScrollToTop />
                      <br />
                      <br />
                      <h1 className='is-size-1 is-uppercase has-text-success'>
                        Hook created!
                      </h1>
                      <br />
                      <button className='button is-small' onClick={(e) => { console.log(e) }}>View Activity Logs</button>
                    </div>
                  </div>
                )}
              </CSSTransition>

              <CSSTransition
                timeout={600}
                classNames='accordion'
                in={!this.state.creationSuccessful}
              >
                {state => (
                  <>
                    {content}
                  </>
                )}
              </CSSTransition>
            </>
          )
        }
      }
    )
  )
)
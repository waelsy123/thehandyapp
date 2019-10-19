import React from 'react'
import LocationSearchInput from '../searchPlaces/locationSearchInput'
import 'react-phone-number-input/style.css'
import { Upload, Icon, Modal, Input, Form, Button, TreeSelect } from 'antd'
import OpeningHoursInput, { defaultWeekDays } from '../openingHours/OpeningHoursInput'

const categories = {
  food: {
    catering: 1,
    home_restuarant: 1,
    home_cafe: 1,
    home_bar: 1,
    chief: 1,
    others: 1
  },
  children: {
    baby_setting: 1,
    other: 1
  },
  artist: {
    music: 1,
    dj: 1,
    painting: 1,
    hand_lettering: 1,
    tattoo: 1,
    dancer: 1,
    others: 1
  },
  sports: {
    instractor: 1,
    personal: 1,
    group: 1,
    others: 1
  },
  building_utilities: {
    plumber: 1,
    electrition: 1,
    painter: 1,
    roof_reconstuction: 1,
    wood_work: 1,
    house_cleaning: 1,

    others: 1
  },
  lessons: {
    Adults: 1,
    school_students: 1,
    Uni_Students: 1,
    language: 1,
    math: 1,
    art: 1,
    music: 1,
    dancing: 1,
    others: 1
  },
  entertainments: {
    home_cinema: 1,
    exterme_sport: 1,
    group_activities: 1,
    event_organisor: 1
  },
  beauty_and_body_care: {
    massage: 1,
    barber: 1,

    others: 1
  },
  travel: {
    local_guide: 1,
    private_taxi: 1
  },
  Accommodation: {
    room: 1,
    appartement: 1,
    House: 1,
    parking: 1
  },
  Automobiles: {
    rent_a_car: 1,
    rent_a_motor: 1,
    mechanist: 1
  },
  clothing: {
    second_hand: 1,
    laundery: 1,
    others: 1
  },
  Financial: {
    Accountant: 1
  },
  film_video: {
    actor: 1,
    director: 1,
    editor: 1,
    amature: 1
  },
  Pets: {
    pets_walking: 1,
    Pets_setting: 1,
    Pets_styling: 1,
    others: 1
  },
  do_my_to_do_list: 1,
  legal: {
    lawyer: 1
  },
  handmade_requets: 1,
  IT: 1,
  Engineering: 1,
  humantiy_and_self_development: {
    psychologist: 1,
    mentor: 1,
    life_coach: 1,
    others: 1
  }
}

const { TreeNode } = TreeSelect
const { TextArea } = Input

// picture uplaod start
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: this.props.fileList || []
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true
    })
  }

  handleChange = ({ fileList }) => {
    console.log(fileList)
    this.setState({ fileList })
    this.props.handleImagesChange(fileList)
  }

  render () {
    console.log(this.props)

    const { previewVisible, previewImage, fileList } = this.state
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className='ant-upload-text'>Upload</div>
      </div>
    )
    return (
      <div className='clearfix'>
        <Upload
          data={{ upload_preset: 'wugrverb' }}
          name='file'
          action='https://api.cloudinary.com/v1_1/superhandy/auto/upload'
          listType='picture-card'
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt='example' style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}
// end pic uplaod

class NormalLoginForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      gallery: [], // this.props.gallery || {},
      categories_lvl0: this.props.categories_lvl0 || [],
      categories_lvl1: this.props.categories_lvl1 || [],
      fileList: this.props.fileList || [],
      _geoloc: this.props._geoloc || {},
      address: this.props.address || '',
      placeId: this.props.placeId || {},
      openingHours: this.props.openingHours || defaultWeekDays
    }
  }

  handlePhoneChange = phone => {
    this.setState({ phone })
  }

  handleOpeningHoursChange = openingHours => {
    this.setState({ openingHours })
  }

  onSelectCategories = categories => {
    console.log(categories)
    this.setState({ categories })
  }

  handleAddressSelect = value => {
    const { location } = value.geometry
    const address = value.formatted_address
    const placeId = value.place_id
    this.setState({
      address,
      placeId,
      _geoloc: { lat: location.lat(), lng: location.lng() }
    })
  }

  handleImagesChange = fileList => {
    this.setState({
      gallery: fileList,
      fileList:
        fileList &&
        fileList.map(item => {
          if (item && item.response && item.response.url) {
            return item.response.url
          } else {
            return item
          }
        })
    })
  }

  componentDidMount () {
    this.props.form.setFieldsValue({
      addressInput: ''
    })
  }

  handleChangeCategories = () => category => {
    let categories_lvl0 = []
    let categories_lvl1 = []

    category &&
      category.map(item => {
        const json = JSON.parse(item)
        categories_lvl0.push(json.category)
        if (json.subcategory) {
          categories_lvl1.push(`${json.category} > ${json.subcategory}`)
        }
      })

    this.setState({
      categories_lvl0: [...new Set(categories_lvl0)],
      categories_lvl1: [...new Set(categories_lvl1)]
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, form) => {
      if (!err) {
        const { title, description, email, phone, website, category } = form

        const {
          categories_lvl0,
          categories_lvl1,
          fileList,
          address,
          placeId,
          openingHours,
          _geoloc
        } = this.state

        const values = {
          title,
          website,
          gallery: {},
          category,
          email,
          phone,
          description,
          address,
          placeId,
          categories_lvl0,
          categories_lvl1,
          fileList,
          openingHours,
          _geoloc
        }
        console.log(values)
        this.props.onSubmit(values)
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    console.log(this.props)

    return (
      <Form onSubmit={this.handleSubmit} className='login-form'>
        <div className='input-group'>
          <div className='title'>
            <h3>Basic info </h3>
          </div>
          <div className='input-fields'>
            <Form.Item label='Activity name'>
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your activity name!'
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder='Activity name'
                />
              )}
            </Form.Item>
            <Form.Item label='Categories'>
              {getFieldDecorator('category', {})(
                <TreeSelect
                  onChange={this.handleChangeCategories()}
                  name='category'
                  showSearch
                  style={{ width: '100%' }}
                  placeholder='Please select'
                  allowClear
                  multiple
                  treeDefaultExpandAll
                >
                  {Object.keys(categories).map(categoryKey => (
                    <TreeNode
                      value={JSON.stringify({
                        category: categoryKey
                          .split('_')
                          .map(
                            name => name.charAt(0).toUpperCase() + name.slice(1)
                          )
                          .join(' ')
                      })}
                      title={categoryKey
                        .split('_')
                        .map(
                          name => name.charAt(0).toUpperCase() + name.slice(1)
                        )
                        .join(' ')}
                      key={`${categoryKey}`}
                    >
                      {typeof categories[categoryKey] === 'object' &&
                        Object.keys(categories[categoryKey]).map(
                          subCategoryKey => (
                            <TreeNode
                              value={JSON.stringify({
                                category: categoryKey
                                  .split('_')
                                  .map(
                                    name =>
                                      name.charAt(0).toUpperCase() +
                                      name.slice(1)
                                  )
                                  .join(' '),
                                subcategory: subCategoryKey
                                  .split('_')
                                  .map(
                                    name =>
                                      name.charAt(0).toUpperCase() +
                                      name.slice(1)
                                  )
                                  .join(' ')
                              })}
                              title={subCategoryKey
                                .split('_')
                                .map(
                                  name =>
                                    name.charAt(0).toUpperCase() + name.slice(1)
                                )
                                .join(' ')}
                              key={`${categoryKey}_${subCategoryKey}`}
                            />
                          )
                        )}
                    </TreeNode>
                  ))}
                </TreeSelect>
              )}
            </Form.Item>
          </div>
        </div>
        <div className='input-group'>
          <div className='title'>
            <h3>Contact details</h3>
          </div>
          <div className='input-fields'>
            <Form.Item label='Activity address' >
              <LocationSearchInput
                clearAddress={this.clearAddress}
                types={['address']}
                defaultValue={this.state.address}
                onSelect={this.handleAddressSelect}
              />
            </Form.Item>
            <Form.Item label='E-mail'>
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!'
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label='Phone Number'>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your phone number!'
                  }
                ]
              })(<Input style={{ width: '100%' }} />)}
            </Form.Item>
            <Form.Item label='Website'>
              {getFieldDecorator('website', {})(<Input defaultValue='' />)}
            </Form.Item>
            <Form.Item label='Description'>
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: 'Please input more description!'
                  }
                ]
              })(
                <TextArea
                  placeholder='Autosize height based on content lines'
                  autosize={{ minRows: 3, maxRows: 50 }}
                />
              )}
            </Form.Item>
          </div>
        </div>
        <div className='input-group'>
          <div className='title'>
            <h3>Gallery mangment</h3>
          </div>
          <div className='input-fields'>
            <PicturesWall
              handleImagesChange={this.handleImagesChange}
              name='gallery'
              fileList={this.state.gallery}
            />
          </div>
        </div>

        <div className='input-group'>
          <div className='title'>
            <h3>Opening hours</h3>
          </div>
          <div className='input-fields'>
            <OpeningHoursInput onChange={this.handleOpeningHoursChange} defaultValue={this.state.openingHours} />
          </div>
        </div>

        <Form.Item>
          <Button type='primary' htmlType='submit' block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const transform = obj => {
  return Object.keys(obj).reduce((acc, cv) => {
    return {
      ...acc,
      [cv]: Form.createFormField({
        ...obj[cv],
        value: obj[cv]
      })
    }
  }, {})
}

const WrappedNormalLoginForm = Form.create({
  name: 'normal_login',
  mapPropsToFields (props) {
    const { title, description, email, phone, website, category } = props
    const transformed = transform({
      title,
      description,
      email,
      phone,
      website,
      category
    })
    console.log(transformed)
    return transformed
  }
})(NormalLoginForm)

export default WrappedNormalLoginForm

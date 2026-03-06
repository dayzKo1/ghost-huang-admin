import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, message, Modal, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons'
import type { Talk } from './types'
import { getTalks, saveTalks } from './api'

const { Title } = Typography
const { TextArea } = Input

const TalksPage = () => {
  const [loading, setLoading] = useState(false)
  const [talks, setTalks] = useState<Talk[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingTalk, setEditingTalk] = useState<Talk | null>(null)
  const [form] = Form.useForm()

  const loadTalks = async () => {
    setLoading(true)
    try {
      const response = await getTalks()
      setTalks(response.data || [])
    } catch (error) {
      console.error(error)
      message.error('Failed to load talks. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTalks()
  }, [])

  const handleEdit = (record: Talk) => {
    setEditingTalk(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleAdd = () => {
    setEditingTalk(null)
    form.resetFields()
    form.setFieldsValue({
      sessions: []
    })
    setModalVisible(true)
  }

  const handleDelete = async (record: Talk) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this talk session?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const updatedTalks = talks.filter(t => t.sessions !== record.sessions)
          await saveTalks(updatedTalks)
          setTalks(updatedTalks)
          message.success('Talk deleted successfully')
        } catch (error) {
          console.error(error)
          message.error('Failed to delete talk')
        }
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingTalk) {
        const updatedTalks = talks.map(t => t.sessions === editingTalk.sessions ? { ...t, ...values } : t)
        await saveTalks(updatedTalks)
        setTalks(updatedTalks)
        message.success('Talk updated successfully')
      } else {
        const newTalk: Talk = {
          ...values,
          sessions: values.sessions || [],
        }
        const updatedTalks = [...talks, newTalk]
        await saveTalks(updatedTalks)
        setTalks(updatedTalks)
        message.success('Talk created successfully')
      }
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error(error)
      message.error('Failed to save talk')
    }
  }

  const columns: ColumnsType<Talk> = [
    {
      title: 'Sessions',
      key: 'sessions',
      render: (_, record) => (
        <div>
          {record.sessions?.map((session, index) => (
            <div key={index} style={{ marginBottom: 8 }}>
              <strong>{session.name}</strong>
              <div style={{ fontSize: 12, color: '#666' }}>
                {session.talks?.length || 0} talks
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={3}>Talks Management</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Talk
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={talks}
          rowKey={(record) => record.sessions?.[0]?.id || ''}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </Card>

      <Modal
        title={editingTalk ? 'Edit Talk' : 'Add Talk'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        width={800}
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical">
          <Form.List name="sessions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" style={{ marginBottom: 16 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'id']}
                      label="Session ID"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Session ID" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      label="Session Name"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Session Name" />
                    </Form.Item>
                    <Form.List name={[name, 'talks']}>
                      {(itemFields, { add: addItem, remove: removeItem }) => (
                        <>
                          {itemFields.map(({ key: itemKey, name: itemName, ...restItemField }) => (
                            <div key={itemKey} style={{ marginBottom: 8, padding: 8, border: '1px solid #d9d9d9', borderRadius: 4 }}>
                              <Form.Item
                                {...restItemField}
                                name={itemName}
                                rules={[{ required: true }]}
                              >
                                <TextArea rows={2} placeholder="Talk content" />
                              </Form.Item>
                              <Button type="link" danger onClick={() => removeItem(itemName)}>
                                Remove Talk
                              </Button>
                            </div>
                          ))}
                          <Button type="dashed" onClick={() => addItem()} block icon={<PlusOutlined />}>
                            Add Talk
                          </Button>
                        </>
                      )}
                    </Form.List>
                    <Button type="link" danger onClick={() => remove(name)}>
                      <MinusCircleOutlined /> Remove Session
                    </Button>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Session
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  )
}

export default TalksPage

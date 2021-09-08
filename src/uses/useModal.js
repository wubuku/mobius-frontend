import { createVNode } from 'vue';
import { Modal, notification } from 'ant-design-vue';
import { LinkOutlined, SmileOutlined, CloseOutlined } from '@ant-design/icons-vue';
import { BROWSER_URL_OF_TRANSACTION } from 'config';

export default () => {
  /**
   * Modal Content with txn
   */
  const TransacationContentBody = (txn) => {
    return createVNode(
      'p',
      {
        className: 'txn-noti',
      },
      [
        'Trasaction Broswer Link: ',
        createVNode(
          'a',
          {
            href: BROWSER_URL_OF_TRANSACTION(txn),
            target: '_blank',
          },
          [createVNode(LinkOutlined), txn],
        ),
      ],
    );
  };

  //
  const openTxnModal = (txn) => {
    Modal.info({
      centered: true,
      width: '480px',
      title: 'Transcation Submit!',
      content: TransacationContentBody(txn),
      okText: 'OK',
    });
  };

  //
  const openTxnCheckedNotification = (txn) => {
    if (!txn) return;
    notification.open({
      message: 'Transcation Success!',
      description: TransacationContentBody(txn),
      icon: createVNode(SmileOutlined, { style: 'color: #108ee9' }),
    });
  };

  const openTxnCheckedFailedNotification = (txn) => {
    if (!txn) return;
    notification.open({
      message: 'Transcation Failed!',
      description: TransacationContentBody(txn),
      icon: createVNode(CloseOutlined, { style: 'color: #FF3333' }),
    });
  };

  return {
    openTxnModal,
    openTxnCheckedNotification,
    openTxnCheckedFailedNotification,
  };
};

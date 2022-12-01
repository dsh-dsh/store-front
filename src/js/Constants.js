export const host = location.hostname == "localhost" ? "http://localhost:8081" : "";

export const Property = { 
    PROJECT: 'PROJECT', 
    STORAGE_FROM: 'STORAGE_FROM', 
    STORAGE_TO: 'STORAGE_TO',
    FONT_SIZE: 'FONT_SIZE',
    INPUT_NULL_VALUE: 'INPUT_NULL_VALUE',
    ADD_REST_FOR_HOLD_1C_DOCS: 'ADD_REST_FOR_HOLD_1C_DOCS',
    PERIOD_AVERAGE_PRICE : 'PERIOD_AVERAGE_PRICE' ,
    DOCS_AVERAGE_PRICE: 'DOCS_AVERAGE_PRICE',
    OUR_COMPANY_ID: 'OUR_COMPANY_ID',
    INGREDIENT_DIR_ID: 'INGREDIENT_DIR_ID',
    HOLDING_DIALOG_ENABLE: 'HOLDING_DIALOG_ENABLE',
    CHECK_HOLDING_ENABLE: 'CHECK_HOLDING_ENABLE',
    DOC_BLOCK_ENABLE: 'DOC_BLOCK_ENABLE'};

export const DocumentType = { 
    POSTING_DOC: 'Поступление',
    RECEIPT_DOC: 'Оприходование',
    MOVEMENT_DOC: 'Перемещение',
    WRITE_OFF_DOC: 'Списание',
    CHECK_DOC: 'Чек ККМ',
    CREDIT_ORDER_DOC: 'Расходный кассовый ордер',
    WITHDRAW_ORDER_DOC: 'ПКО',
    REQUEST_DOC: 'Заявка',
    INVENTORY_DOC: 'Инвентаризация'
};

export const PaymentType = { 
    TAX_PAYMENT: 'Оплата налога',
    CLIENT_PAYMENT: 'Оплата от покупателя',
    SUPPLIER_PAYMENT: 'Оплата поставщику',
    OTHER_PAYMENT: 'Прочее',
    SALARY_PAYMENT: 'Выплата заработной платы',
    SALE_CASH_PAYMENT: 'Выручка наличными',
    SALE_CARD_PAYMENT: 'Выручка по картам',
    SALE_QR_PAYMENT: 'Выручка по QR'
};

export const CheckPaymentType = { 
    CASH_PAYMENT: 'Оплата наличными',
    CARD_PAYMENT: 'Оплата картой',
    QR_PAYMENT: 'Оплата QR',
    DELIVERY_PAYMENT: 'Оплата через доставку'
};

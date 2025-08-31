export interface HmisReporte {
    CabeceraContratoHmis: CabeceraContratoHmis | undefined;
    HmisContrato?: HmisContrato[];

  }

  export interface CabeceraContratoHmis {
    salesContractNumber?: string;
    primaryFullName?: string;
    batchId?: number;
    active?: boolean;
    guaranteedOwnership?: boolean;
    planEffectiveDate?: string;
    batchNumber?: number;
    posted?: boolean;
  }
  
  export interface HmisContrato {
    InformacionContrato?: InformacionContrato[];
    NombreContrato?: NombreContrato[];
    PropietarioContratante?: PropietarioContratante[];
    ActividadContrato?: ActividadContrato[];
    AbonoContrato?: AbonoContrato[];
    TransaccionContrato?: TransaccionContrato[];
    ItemContrato?: ItemContrato[];
    FacilidadesContrato?: FacilidadesContrato[];
    InformacionFinancieraContrato?: InformacionFinancieraContrato[];
  }
  

  
  export interface InformacionContrato {
    sales_id?: number;
    Sales_Contract_Nbr?: number;
    Sale_Dt?: string;
    Location_Cd?: string;
    Sales_Status_Cd?: string;
    Sales_Type_Cd?: string;
    Sales_Need_Type_Cd?: string;
    Lead_Src_Cd?: string;
    Currency_Cd?: string;
    Descr_01?: string | null;
    Descr_02?: string | null;
    Descr_03?: string | null;
    Fund_Location_Group_Cd?: string;
    Product_Location_Group_Cd?: string;
    Qualified_For_Case_Volume?: number;
    pre_printed_contract_nbr?: string | null;
    Comisionista?: Comisionista[];
    Claims?: Claims[];
    ComentarioLink?: ComentarioLink[];
  }
  
  export interface Comisionista {
    Name?: string;
    No?: string;
  }
  
  export interface Claims {
    Due_Dt?: string;
    Sales_ID?: number;
    claim_cd?: string;
    Reference_Nbr?: number;
    Amt?: number;
    Amt_Received?: number;
    Received_Dt?: string | null;
    Last_Update_Dt?: string;
    Update_User_ID?: string;
  }
  
  export interface ComentarioLink {
    object_id?: number;
    Object_Nbr?: string;
    Object_type_cd?: string;
    Primary_Name_sort?: string;
    Name_ID?: number;
    AUDFlag?: number;
  }  

  export interface NombreContrato {
    Name_Id?: number;
    Name_Type_Cd?: string;
    Name_Type_Descr?: string;
    Ethnicity?: string;
    Religion_Cd?: string;
    Primary_Person_or_Business?: string;
    Primary_Full_Name?: string;
    Primary_Prefix?: string;
    Primary_First_Name?: string;
    Primary_Middle_Name?: string;
    Primary_Last_Name?: string;
    Primary_Suffix?: string;
    Primary_Name_Sort?: string;
    Primary_Street_Address?: string;
    Primary_City?: string;
    Primary_State?: string;
    Primary_Zip?: string;
    Send_No_Mail?: string;
    Phone_1?: string;
    SS_Nbr?: string;
    Birth_Dt?: string;
    Deceased?: string;
    Death_Dt?: string;
    Account_Nbr?: string;
    Last_Update_Dt?: string;
    Update_User_ID?: string;
    Birth_State_Cd?: string;
    Maiden_Name?: string;
    Race?: string;
    Occupation?: string;
    Business?: string;
    County?: string;
    Education_Yrs?: string;
    Gender?: string;
    Birth_Dt_Partial?: string;
    Death_Dt_Partial?: string;
    Primary_Street_No?: string;
    Primary_Street_Alpha?: string;
    Primary_Street_Name?: string;
    Display_Sequence?: number;
  }
  
  export interface PropietarioContratante {
    Name_Id?: number;
    Name_Type_Cd?: string;
    Name_Type_Descr?: string;
    Ethnicity?: string;
    Religion_Cd?: string;
    Primary_Person_or_Business?: string;
    Primary_Full_Name?: string;
    Primary_Prefix?: string;
    Primary_First_Name?: string;
    Primary_Middle_Name?: string;
    Primary_Last_Name?: string;
    Primary_Suffix?: string;
    Primary_Name_Sort?: string;
    Primary_Street_Address?: string;
    Primary_City?: string;
    Primary_State?: string;
    Primary_Zip?: string;
    Send_No_Mail?: string;
    Phone_1?: string;
    SS_Nbr?: string;
    Birth_Dt?: string;
    Deceased?: string;
    Death_Dt?: string;
    Account_Nbr?: string;
    Last_Update_Dt?: string;
    Update_User_ID?: string;
    Birth_State_Cd?: string;
    Maiden_Name?: string;
    Race?: string;
    Occupation?: string;
    Business?: string;
    County?: string;
    Education_Yrs?: string;
    Gender?: string;
    Birth_Dt_Partial?: string;
    Death_Dt_Partial?: string;
    Primary_Street_No?: string;
    Primary_Street_Alpha?: string;
    Primary_Street_Name?: string;
    Display_Sequence?: number;
  }

  export interface ActividadContrato {
    Name_id?: number;
    Primary_Name_Sort?: string;
    ccount_Nbr?: string;
    sales_contract_nbr?: number;
    sale_dt?: string;             // ISO string
    sales_type_cd?: string;
    role?: string;
    balance_due?: number;
    pymt_amt?: number;
    next_pymt_dt?: string;        // ISO string
    sales_id?: number;            // Nota: repetido, puede omitirse si quieres
    txn_type_cd?: string;
    contract_total?: number;
    amount_financed?: number;
    Sales_Id?: number;
    activity_date?: string;       // Fecha y hora en formato ISO string
    activity?: string;
    activity_descr?: string;
    amount?: number;
    cash_receipt_nbr?: string;
    cash_receipt_id?: number;
    payment_type_descr?: string;
    reference_nbr?: string | null;
    payer_name?: string | null;
    pmt_applied_amt?: number;
    interest_amt?: number;
    late_charge_amt?: number;
  }
  
  export interface AbonoContrato {
    sales_contract_nbr?: number;
    cash_receipt_nbr?: string;
    cash_receipt_id?: number;
    principle_amount?: number;
    cash_receipt_dt?: string;      // Fecha y hora en formato ISO string
    reference_nbr?: number | string;
    pmt_applied_amt?: number;
    interest_amt?: number;
    descr?: string;
    late_charge_amt?: number;
    batch_id?: number;
    batch_nbr?: number;
    posted_dt?: string;            // Fecha y hora en formato ISO string
    amt?: number;  
    adj_amt?: number;
    batch_dt?: string;             // Fecha en formato ISO string
    balance_after_payment?: number;
    sales_id?: number;
    pmt_applied_dt?: string;       // Fecha y hora en formato ISO string
    payer_name?: string;
    posted?: number;               // probablemente booleano (1 o 0)
  }
  
  export interface TransaccionContrato {
    txn_dt: string;                 // Fecha de la transacción
    gl_amt_type_cd: string;        // Tipo de monto contable (S, E, R, etc.)
    gl_distrib_evnt_cd: string;    // Código del evento contable
    sort_group: number;            // Grupo de ordenamiento
    amt: number;                   // Monto de la transacción
    qty: number;                   // Cantidad
    posted: number;                // Indicador si fue contabilizado (1 = sí)
    update_user_id: string;        // Usuario que actualizó
    sales_contract_nbr: number;    // Número de contrato
    sales_item_dt: string;         // Fecha del ítem de venta
    product_item_id: number;       // ID del producto
    item_code: string;             // Código del ítem
    item_cd_desc: string;          // Descripción del ítem (ej. Finance Charges)
    sales_item_dt1: string;         // Fecha del ítem de venta
    batch_id: number;              // ID del lote (batch)
    sales_item_id: number;         // ID del ítem de venta
    batch_nbr: number;             // Número del lote
  }
  
  export interface ItemContrato {
    sales_contract_nbr: string;
    sale_dt: string;
    sales_type_cd: string;
    sales_status_cd: string;
    primary_full_name: string;
    primary_street_name: string;
    phone_1: string;
    primary_city: string;
    sales_item_id: string;
    location_group_cd: string;
    item_cd: string;
    sales_id: number;
    txn_type_cd: string;
    txn_descr: string;
    sales_need_type_cd: string;
    lead_src_cd: string;
    sales_item_status_cd: string;
    lot_sell_unit_id: string | null;
    product_item_id: number;
    item_cd_desc: string;
    sales_item_dt: string;
    sales_purchase_dt: string;
    sales_delivery_dt: string | null;
    sales_installed_dt: string | null;
    sales_item_qty_sold: number;
    sales_item_qty_used: number | null;
    sales_price: number;
    sales_cost: number;
    sales_purchase_cost: number;
    amt_pd: number;
    tax: number;
    discount: number;
    sales_comment: string | null;
    pmt_distribution_mthd: string;
    pmt_seq: number | null;
    pmt_seq_group: string;
    posted: number;
    bill_bill_flag: string | null;
    defr_flg: string | null;
    last_update_dt: string;
    update_user_id: string;
    beneficiary_required: number;
    taxable: number;
    compute_tax_on_cost: number;
    item_type_cd: string;
    lock_price_level_1: number;
    lock_cost: number;
    price_level_1: number;
    price_level_2: number;
    price_level_3: number;
    item_paid: number;
    auto_associate_property: number;
    lead_src_descr: string;
    property_required: number;
    cost_pct_retail_from: number;
    cost_pct_retail_to: number;
    interment_required: number;
    memorial_required: number;
    guaranteed_item: number;
    item_business_cd: string;
    endowment_type: string | null;
    commis_cb_method: string | null;
    commis_cb_amt_or_dollar: string | null;
    reverse_from_reserve: number;
    supplier_cd: string | null;
    delivery_status_cd: string | null;
    delivery_cost: string | null;
    sales_sales_need_type_cd: string;
    discount_reason_descr: string | null;
    rpted_cost: string | null;
    show_on_line_items: number;
    cancel_like_interest: number;
    cost_display: number;
    pct_of_retail: number;
    is_multiple_price: number;
    delivery_category_cd: string | null;
    pre_acq_eval_amt: string | null;
    override_delivery_category_cd: string | null;
    delivery_status_descr: string | null;
    benef_multi: number;
    exclude_from_finance_charge: number | null;
  }
  
  export interface FacilidadesContrato {
    Sales_Contract_Nbr: string;
    Sale_Dt: string; // formato ISO 'YYYY-MM-DDTHH:mm:ss.sssZ'
    Sales_Type_Cd: string;
    Sales_Status_Cd: string;
    Primary_Full_Name: string;
    Primary_Street_Name: string;
    Phone_1: string;
    Primary_City: string;  
    Sales_finance_id: number;
    Sales_Id: number;
    Plan_effective_dt: string;
    Ar_gl_acct_id: number;
    Terms_cd: string;
    Tax_structure_cd: string | null;
    txn_descr: string;
    Type: string;
    Txn_type_cd: string;
    Interest_mthd_cd: string;
    Days_interest_free: number;
    Nbr_of_pymts: number;
    Due_dt: string;  
    Pymnt_start_dt: string;
    Next_pymt_dt: string;
    Txn_dt: string;
    Late_charge_dollar_or_percent: string;
    Late_charge_value: number;
    Purchase_price: number;
    Sales_tax: number;
    Down_pymt: number;
    Discounts_credits: number;
    Amount_financed: number;
    Adjustments: number;  
    Late_charges: number;
    Total_of_pymts: number;
    Balance_due: number;
    Interest_rate: number;
    Pymts_per_year: number;
    Payoff_dt: string | null;
    Pymt_amt: number;
    Finance_charge: number;
    Batch_id: number;
    Final_pymt_amt: number;
    Next_interest_dt: string;
    Reference_nbr: string;
    Override_pymt_amt: number;
    Authorized_sales_counselor_id: string | null;  
    Credit_rating_cd: string | null;
    Batch_Control_Total: number;
    Cash_Gl_Acct_ID: string | null;
    Capture_credit_info: number;
    Default_Down_Payment_Type_Cd: string;
    Stop_Contract_Cancel_balance_Due: number;
    Gl_main_acct: string;
    Gl_sub_acct: number;
    Descr: string;  
    Sale_entry_dt: string;
    Location_cd: number;
    posted: number;
    Batch_nbr: number;
    Ready_To_Post: number;
    Posting_Status_Fg: number;
    Name: string;
    Tot_pmts_allow_override: number;
    profit_ctr: number;
    vary_ar_by_location: number;
    Days_Finance_charges_forgiven: number;  
    Last_Pymt_Dt: string;
  }
  
  export interface InformacionFinancieraContrato {
    sales_finance_id: number;
    payoff_dt: string | null;
    last_pymt_amt: number;
    last_pymt_dt: string;
    last_statement_amt: number;
    last_statement_dt: string | null;
    stment_jan: number;
    stment_feb: number;
    stment_mar: number;
    stment_apr: number;
    stment_may: number;
    stment_jun: number;
    stment_jul: number;
    stment_aug: number;
    stment_sep: number;
    stment_oct: number;
    stment_nov: number;
    stment_dec: number;
    suppress_statement_printing: number;
    contact_dt: string;
    contact_status_cd: string;
    promise_pay_dt: string | null;
    promise_pay_amount: number;
    follow_up_dt: string | null;
    suppress_letter_printing: number;
    last_update_dt: string;
    update_user_id: string;
    adjustments: number;
    late_charges: number;
    principle: number;
    finance_charge: number;
    principle_applied: number;
    finance_charge_applied: number;
    late_charge_applied: number;
    pymnt_start_dt: string;
    pymt_amt: number;
    interest_rate: number;
    nbr_of_pymts: number;
    pymts_per_year: number;
    amount_financed: number;
    sales_id: number;
    posted: number;
    total_of_pymts: number;
    down_pymt: number;
    discounts_credits: number;
    balance_due: number;
    final_pymt_amt: number;
    sale_dt: string;
    days_interest_free: number;
    interest_mthd_cd: string;
    location_cd: number;
    stmnt_freq_cd: string;
    auto_cancel_min_days: number | null;
    collections_comments: string;
    last_coupon_dt: string | null;
    supress_deeds: number;
    Statement_Language_Cd: string | null;
    sales_tax: number;
    purchase_price: number;
    allow_auto_cancel: number;
    auto_cancel_warning_dt: string | null;
    auto_cancel_dt: string | null;
    Days_Finance_Charges_Forgiven: number;
  }

  export interface HmisContratoLista{
    Sales_Contract_Nbr?: number;  
    Primary_Full_Name?: string; 
    Sale_Dt?: string;
  }
  
import * as XLSX from 'xlsx';

export const exportAllCustomerExcel = (customer) => {

    const workbook = XLSX.utils.book_new();
    // DAR Setup
    const sheetName1 = 'CustomerDetails';
    let workSheetData1 = []
    customer.map((data, index) => {
        const obj = {
            customer_creation_type: data?.purifier_details?.creation_type || data?.whole_house_details?.creation_type,
            cid: data?.cid,
            name: data?.first_name + ' ' + data?.last_name,
            address: data?.address?.address,
            land_mark: data?.address?.land_mark,
            place: data?.address?.place,
            post_office: data?.address?.post,
            pin: data?.address?.pin_code,
            district: data?.address?.district,
            zone: data?.zone_name,
            contact1: data?.contact1,
            contact2: data?.contact2,
            contact_alternative: null,
            whatsapp1: data?.whatsapp1,
            whatsapp_alternative: null,
            compliment_amount: data?.debit_amount,
            credit_amount: data?.credit_amount,
            purifier_name: `${data?.purifier_name || ''} ${data?.purifier_category || ''}`,
            purifier_installation_date: data?.purifier_details?.installed_at ? new Date(data?.purifier_details?.installed_at) : "",
            who_installed_the_purifier: data?.who_installed_the_purifier,
            purifier_customer_status: data?.purifier_customer_status,
            ssp_card_number: data?.purifier_details?.ssp_card_number,
            carbon_usage_start_date: data?.purifier_details?.carbon_filter_start_date ? new Date(data?.purifier_details?.carbon_filter_start_date) : "",
            purifier_next_periodical_service_date: data?.purifier_details?.next_periodical_service_date ? new Date(data?.purifier_details?.next_periodical_service_date) : "",
            carbon_usage_expiry_date: data?.purifier_details?.carbon_filter_expiry_date ? new Date(data?.purifier_details?.carbon_filter_expiry_date) : "",
            purifier_service_package_start_from: data?.purifier_details?.package_started_date ? new Date(data?.purifier_details?.package_started_date) : "",
            purifier_service_package_end_on: data?.purifier_details?.package_expiry_date ? new Date(data?.purifier_details?.package_expiry_date) : "",
            no_of_given_service_of_purifier: data?.purifier_details?.service_count?.length || 0,
            purifier_technician_last_visited_on: data?.purifier_details?.technician_last_visited_date ? new Date(data?.purifier_details?.technician_last_visited_date) : "",
            purifier_product_price: data?.purifier_details?.product_price_at_install,
            purifier_bill_date: data?.purifier_details?.bill_received_date ? new Date(data?.purifier_details?.bill_received_date) : "",
            purifier_service_section_admin_description: null,
            purifier_service_section_technician_description: null,
            wh_name: data?.wh_name,
            wh_customer_status: data?.wh_customer_status,
            wh_installation_date: data?.whole_house_details?.installed_at ? new Date(data?.whole_house_details?.installed_at) : "",
            who_installed_the_wh: data?.who_installed_the_wh,
            wh_refilling_date: data?.whole_house_details?.last_refilling_date ? new Date(data?.whole_house_details?.last_refilling_date) : "",
            who_refilled_the_wh: data?.who_refilled_the_wh,
            wh_product_price: data?.whole_house_details?.product_price_at_install,
            wh_bill_date: data?.whole_house_details?.bill_received_date ? new Date(data?.whole_house_details?.bill_received_date) : "",
            wh_refilling_price: null,
            package_product_price: data?.package_price_at_install,
            package_bill_date: data?.purifier_details?.bill_received_date || data?.whole_house_details?.bill_received_date ? new Date(data?.purifier_details?.bill_received_date || data?.whole_house_details?.bill_received_date) : "",
            enquiry_type: data?.purifier_details?.enquiry_type || data?.whole_house_details?.enquiry_type,
            enquiry_serial_no: data?.purifier_details?.enquiry_srl_no || data?.whole_house_details?.enquiry_srl_no,
            who_collected_the_enquiry: data?.who_collected_the_enquiry,
            care_of_id: data?.care_of_id,
            care_of_whom: data?.purifier_details?.care_of_whom || data?.whole_house_details?.care_of_whom,
            other_product_name: null,
            other_product_customer_status: null,
            other_product_installation_date: null,
            other_product_price: null,
            other_product_bill_date: null,
            rating_star: data?.star_rate

        }
        workSheetData1.push(obj)
        return obj;
    })

    const worksheet1 = XLSX.utils.json_to_sheet(workSheetData1);
    XLSX.utils.book_append_sheet(workbook, worksheet1, sheetName1);

    return workbook;
};

export const exportSomeCustomerToExcel = (customer) => {

    const workbook = XLSX.utils.book_new();
    // DAR Setup
    const sheetName1 = 'Sheet 1';
    let workSheetData1 = []
    customer.map((data, index) => {
        const obj = {
            'CID': data?.cid,
            'FULL NAME': data?.full_name,
            'STAR RATE': data?.star_rate,
            'ADDRESS': data?.address?.address,
            'PLACE': data?.address?.place,
            'CITY': data?.address?.city_name,
            'PIN': data?.address?.pin_code,
            'LANDMARK': data?.address?.land_mark,
            'STATE': data?.address?.state_name,
            'CONTACT 1': data?.contact1,
            'CONTACT 2': data?.contact2,
            'PURIFIER STATUS': data?.purifier_customer_status,
            'WH STATUS': data?.wh_customer_status,
            'DELETED': data?.delete ? "Yes" : 'No',
            'BLOCKED': data?.blocked ? "Yes" : 'No',
        }
        workSheetData1.push(obj)
        return obj;
    })

    const worksheet1 = XLSX.utils.json_to_sheet(workSheetData1);
    XLSX.utils.book_append_sheet(workbook, worksheet1, sheetName1);

    return workbook;
};
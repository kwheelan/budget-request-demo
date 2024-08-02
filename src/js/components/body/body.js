import './body.css';

import Welcome from '../../components/welcome/welcome.js'
import Accordion from '../accordion/accordion.js';
import FileUpload from '../file_upload/file_upload.js';
import Modal from '../modal/modal.js';
import NavButtons from '../nav_buttons/nav_buttons.js';
import Prompt from '../prompt/prompt.js';
import Sidebar from '../sidebar/sidebar.js';
import Table from '../table/table.js';
import Tooltip from '../tooltip/tooltip.js';  

function resetPage() {
    // hide everything in the body
    Welcome.hide();
    Modal.clear();
    Modal.hide();
    NavButtons.hide();
    Prompt.hide();
    Table.hide();
    Sidebar.hide();
    Accordion.hide();
    FileUpload.hide();
    Tooltip.hide();

    Prompt.Buttons.reset();
    // disable submit button
    Modal.Submit.deinit();
}

export const Body = {
    reset : resetPage
}

export default Body;
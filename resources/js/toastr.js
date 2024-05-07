import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export function useToastr() {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "7000",
        "hideDuration": "5000",
        "timeOut": "7000",
        "extendedTimeOut": "7000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    return toastr;
}
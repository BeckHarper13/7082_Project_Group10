(function () {
            'use strict';
            const form = document.querySelector('.needs-validation');

            form.addEventListener('submit', function (event) {
                // clear any custom validity first
                const pw = document.getElementById('password');
                pw.setCustomValidity('');

                // enforce password minimum of 4 characters (extra safety)
                if (pw.value.length < 4) {
                    pw.setCustomValidity('Password must be at least 4 characters.');
                    document.getElementById('passwordFeedback').textContent = pw.validationMessage;
                }

                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add('was-validated');
            }, false);
        })();
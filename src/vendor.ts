// Fonts
import "@fontsource/klee-one";

// Icons
import { library, dom } from "@fortawesome/fontawesome-svg-core";

import { faGithubAlt } from "@fortawesome/free-brands-svg-icons/faGithubAlt";
// <i class="fa-brands fa-github-alt"></i>
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/faShoppingCart";
// <i class="fa-solid fa-cart-shopping"></i>
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
// <i class="fa-solid fa-bars"></i>
import { faMugHot } from "@fortawesome/free-solid-svg-icons/faMugHot";
// <i class="fa-solid fa-mug-hot"></i>
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
// <i class="fa-solid fa-trash"></i>
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons/faFloppyDisk";
// <i class="fa-solid fa-floppy-disk"></i>
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
// <i class="fa-solid fa-download"></i>
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
// <i class="fa-solid fa-plus"></i>
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
// <i class="fa-solid fa-square-check"></i>

library.add(
    faBars,
    faShoppingCart,
    faGithubAlt,
    faMugHot,
    faTrash,
    faFloppyDisk,
    faDownload,
    faPlus,
    faCheck,
);

dom.watch();

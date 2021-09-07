import happyFarmer from '../images/happy-farmer.jpg'

export default function OurMission(props){
    return(
        <div id="ourMissionContainer">
            <div id="ourMission">
                <div>
                    <h1>Our Mission</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac leo augue. Sed molestie leo non ante varius accumsan. Nulla tristique est non dui tincidunt, sed fringilla lorem pharetra. Donec aliquam rutrum quam sit amet luctus. Proin et ante quis lectus luctus iaculis. Nullam ut nisi interdum, pharetra lectus at, vestibulum velit. Pellentesque maximus augue eget sodales mollis. Curabitur ac magna pretium nisi tempor vehicula. Mauris quis orci tincidunt, elementum ante eu, pharetra tortor. Donec enim orci, condimentum quis commodo eu, dignissim vitae ipsum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

    Praesent ut leo lectus. Sed facilisis lacus quis leo posuere, eu scelerisque ex volutpat. Nulla non enim facilisis, accumsan est sollicitudin, aliquet libero. Pellentesque accumsan id nunc vel vehicula. Mauris molestie volutpat erat, id fringilla dui lobortis sed. Vestibulum vulputate rutrum hendrerit. Suspendisse orci augue, dictum quis pretium id, cursus nec mi. Ut pellentesque rutrum diam non porttitor. Nulla dictum pretium tempor. Vivamus laoreet sem sollicitudin, molestie est sit amet, fermentum sem. Pellentesque commodo odio vitae turpis molestie interdum. Duis at accumsan leo. Vestibulum tristique nunc non nunc fringilla accumsan.</p>
                </div>
                <div>
                    <img  src={happyFarmer} alt="women standing in field holding leaves"/>
                </div>
            </div>
        </div>
    )
}
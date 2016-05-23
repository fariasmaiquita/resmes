<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        
        <!-- pageCSS -->
        {{ HTML::style('assets/css/export-layouts/one.css') }}
        <style>
            
            /* Typography Settings */
            
            table {
                
                /* Body Font Family */
                @if($resumeData['typography']['body']->count() > 0)
                    @foreach($resumeData['typography']['body']->get() as $bodyTypo)
                        font-family: '{{ $bodyTypo->font_family }}';
                    @endforeach
                @else
                    font-family: '{{ $resumeData['defaults']['font']['family'] }}';
                @endif
                
                /*Overall Font Size */
                @if($resumeData['typography']['size']->count() > 0)
                    @foreach($resumeData['typography']['size']->get() as $sizeTypo)
                        font-size: {{ $sizeTypo->font_size }};
                    @endforeach
                @else
                    font-size: {{ $resumeData['defaults']['size']['value'] }};
                @endif
            }
            
            /* Headings Custom Font Family */
            @if($resumeData['typography']['headings']->count() > 0)
                @foreach($resumeData['typography']['headings']->get() as $hdgTypo)
                    h1, h2, h3, h4 {
                        font-family: '{{ $hdgTypo->font_family }}';
                    }
                @endforeach
            @endif
            
            /* Italics Font Family */
            @if($resumeData['typography']['italics']->count() > 0)
                @foreach($resumeData['typography']['italics']->get() as $italicsTypo)
                    em, blockquote, .italics, .main .entry tr td:first-child {
                        font-family: '{{ $italicsTypo->font_family }}';
                    }
                @endforeach
            @endif
            
            .tinted {
                /* Typography Theme Color */
                @if($resumeData['typography']['color']->count() > 0)
                    @foreach($resumeData['typography']['color']->get() as $colorTypo)
                        color: {{ $colorTypo->palette_color }} !important;
                    @endforeach
                @else
                    color: {{ $resumeData['defaults']['palette']['color'] }} !important;
                @endif
            }
            
        </style>
        <!-- /pageCSS -->
    </head>
    <body>
        
        <!-- pageHTML -->
        
        <div id="wrapper">
            <table id="skeleton">
                <thead>
                    
                    <!-- General Info -->
                    
                    @foreach($resumeData['general']->get() as $general)
                    
                        <tr>
                            <td class="main">

                                <h1>{{ $general->full_name }}</h1>

                                @if($general->headline)
                                    <h2 class="tinted boldless">
                                        {{ $general->headline }}
                                    </h2>
                                @endif

                                <br>
                                
                            </td>

                            <td class="aside">
                                <div id="header-mark">
                                    <div class="icon-bullet tinted"></div>
                                    <div id="mark-letter">
                                        {{ $general->full_name[0] }}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    
                        <tr>
                            <td class="main">
                                <table class="entry margin-aligner">
                                    <tbody>

                                        @if($general->location)
                                            <tr>
                                                <td>based in</td>
                                                <td>{{ $general->location }}</td>
                                            </tr>
                                        @endif

                                        <tr>
                                            <td>phone nr.</td>
                                            <td>{{ $general->phone }}</td>
                                        </tr>

                                        <tr>
                                            <td>email</td>
                                            <td>
                                                <a href="mailto:{{ $general->email }}">
                                                    {{  $general->email }}
                                                </a>
                                            </td>
                                        </tr>

                                        @if($general->website)
                                            <tr>
                                                <td>website</td>
                                                <td>
                                                    <?php
                                                    $protocol = strpos($general->website, '://') === false ?
                                                        'http://' : '';
                                                    ?>
                                                    <a href="{{ $protocol . $general->website }}">
                                                        {{ $general->website }}
                                                    </a>
                                                </td>
                                            </tr>
                                        @endif

                                    </tbody>
                                </table>
                            </td>
                            
                            <td class="aside">
                                @if($general->summary)
                                    <div class="long-text italics text-align-right remove-padding">
                                        {{ $general->summary }}
                                    </div>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </thead>
                
                <tbody>
                    <tr>
                        
                        <td class="main">
                            
                            <!-- Experiences -->
                            
                            @if($resumeData['experience']->count() > 0)
                                <div class="icon-bullet separator tinted"></div>
                            @endif
                            
                            @foreach($resumeData['present_experience']->get() as $experience)
                                <table class="entry {{ $experience->description ? '' : 'margin-aligner' }}">
                                    <tbody>
                                        <tr class="header">
                                            <td class="align-bottom">
                                                {{ date('M Y', strtotime($experience->start_date)) }}
                                            </td>
                                            <td>
                                                <h3>
                                                    <span>{{ $experience->company }}</span>
                                                    @if($experience->location)
                                                        <span class="sub-heading">
                                                            <br>
                                                            {{ $experience->location }}
                                                        </span>
                                                    @endif
                                                </h3>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="align-top">
                                                &ndash; Present
                                            </td>
                                            <td>
                                                <span class="tinted">
                                                    {{ $experience->title }}
                                                </span>
                                            </td>
                                        </tr>
                                        @if($experience->description)
                                            <tr>
                                                <td>&nbsp;</td>
                                                <td class="long-text">
                                                    {{ $experience->description }}
                                                </td>
                                            </tr>
                                        @endif
                                    </tbody>
                                </table>
                            @endforeach
                            
                            @foreach($resumeData['experience']->get() as $experience)
                                @if(!is_null($experience->end_date))
                                    <table class="entry {{ $experience->description ? '' : 'margin-aligner' }}">
                                        <tbody>
                                            <tr class="header">
                                                <td class="align-bottom">
                                                    {{ date('M Y', strtotime($experience->start_date)) }}
                                                </td>
                                                <td>
                                                    <h3>
                                                        <span>{{ $experience->company }}</span>
                                                        @if($experience->location)
                                                            <span class="sub-heading">
                                                                <br>
                                                                {{ $experience->location }}
                                                            </span>
                                                        @endif
                                                    </h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="align-top">
                                                    &ndash;
                                                    {{ date('M Y', strtotime($experience->end_date)) }}
                                                </td>
                                                <td>
                                                    <span class="tinted">
                                                        {{ $experience->title }}
                                                    </span>
                                                </td>
                                            </tr>
                                            @if($experience->description)
                                                <tr>
                                                    <td>&nbsp;</td>
                                                    <td class="long-text">
                                                        {{ $experience->description }}
                                                    </td>
                                                </tr>
                                            @endif
                                        </tbody>
                                    </table>
                                @endif
                            @endforeach
                            
                            <!-- Education -->
                            
                            @if($resumeData['education']->count() > 0)
                                <div class="icon-bullet separator tinted"></div>
                            @endif
                    
                            @foreach($resumeData['present_education']->get() as $education)
                                <table class="entry {{ $education->description ? '' : 'margin-aligner' }}">
                                    <tbody>
                                        <tr class="header">
                                            <td class="align-bottom">
                                                {{ date('Y', strtotime($education->start_year)) }}
                                            </td>
                                            <td>
                                                <h3>{{ $education->school }}</h3>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="align-top">
                                                &ndash; Present
                                            </td>
                                            <td>
                                                <span class="tinted">
                                                    {{ $education->degree }} in
                                                    {{ $education->course }}
                                                </span>
                                            </td>
                                        </tr>
                                        @if($education->description)
                                            <tr>
                                                <td>&nbsp;</td>
                                                <td class="long-text">
                                                    {{ $education->description }}
                                                </td>
                                            </tr>
                                        @endif
                                    </tbody>
                                </table>
                            @endforeach
                            
                            @foreach($resumeData['education']->get() as $education)
                                @if(!is_null($education->end_year))
                                    <table class="entry {{ $education->description ? '' : 'margin-aligner' }}">
                                        <tbody>
                                            <tr class="header">
                                                <td class="align-bottom">
                                                    {{ date('Y', strtotime($education->start_year)) }}
                                                </td>
                                                <td>
                                                    <h3>{{ $education->school }}</h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="align-top">
                                                    &ndash;
                                                    @if($education->end_year)
                                                        {{ date('Y', strtotime($education->end_year)) }}
                                                        @if(strtotime($education->end_year) >  time())
                                                            (Expected)
                                                        @endif
                                                    @else
                                                        Present
                                                    @endif
                                                </td>
                                                <td>
                                                    <span class="tinted">
                                                        {{ $education->degree }} in
                                                        {{ $education->course }}
                                                    </span>
                                                </td>
                                            </tr>
                                            @if($education->description)
                                                <tr>
                                                    <td>&nbsp;</td>
                                                    <td class="long-text">
                                                        {{ $education->description }}
                                                    </td>
                                                </tr>
                                            @endif
                                        </tbody>
                                    </table>
                                @endif
                            @endforeach
                            
                        </td>
                        
                        <td class="aside">
                            <div class="separator">&nbsp;</div>
                            
                            <!-- Skills -->
                            
                            @if($resumeData['skill']->count() > 0)
                            
                                @if($resumeData['heading']['skills']->count() > 0)
                                    @foreach($resumeData['heading']['skills']->get() as $skillsHdg)
                                        @if($skillsHdg->title)
                                            <h4 class="title">
                                                {{ $skillsHdg->title }}
                                                @if($skillsHdg->subtitle)
                                                    <br>
                                                    <span class="sub-heading boldless">
                                                        {{ $skillsHdg->subtitle }}
                                                    </span>
                                                @endif
                                            </h4>
                                        @endif
                                    @endforeach
                                @else
                                    <h4 class="title">Skills</h4>
                                @endif

                                @foreach($resumeData['skill']->get() as $skill)
                                    <div class="entry {{ $skill->details ? '' : 'margin-aligner' }}">
                                        <h4 class="boldless">
                                            {{ $skill->expertise }}
                                        </h4>
                                        @if($skill->details)
                                            <div class="long-text italics">
                                                {{ $skill->details }}
                                            </div>
                                        @endif
                                    </div>
                                @endforeach

                                @if($resumeData['additional']->count() > 0)
                                    <div class="icon-bullet separator tinted"></div>
                                @endif
                            
                            @endif
                            
                            <!-- Interests -->
                            
                            @foreach($resumeData['additional']->get() as $additional)
                                
                                @if($additional->type == 'interests')

                                    @if($resumeData['heading']['interests']->count() > 0)
                                        @foreach($resumeData['heading']['interests']->get() as $interestsHdg)
                                            @if($interestsHdg->title)
                                                <h4 class="title">
                                                    {{ $interestsHdg->title }}
                                                    @if($interestsHdg->subtitle)
                                                        <br>
                                                        <span class="sub-heading boldless">
                                                            {{ $interestsHdg->subtitle }}
                                                        </span>
                                                    @endif
                                                </h4>
                                            @endif
                                        @endforeach
                                    @else
                                        <h4 class="title">Interests</h4>
                                    @endif

                                    <div class="long-text italics">
                                        {{ $additional->content }}
                                    </div>

                                    @if($resumeData['additional']->count() > 1)
                                        <div class="icon-bullet separator tinted"></div>
                                    @endif

                                @endif
                            
                            @endforeach
                            
                            <!-- Testimonial -->
                            
                            @foreach($resumeData['additional']->get() as $additional)
                                
                                @if($additional->type == 'testimonial')
                                    <div class="long-text title tinted">
                                        {{ $additional->content }}
                                    </div>
                                    <div class="long-text">
                                        <span>{{ $additional->author }}</span>
                                        @if($additional->author_position)
                                            <span>/ {{ $additional->author_position }}</span>
                                        @endif
                                        @if($additional->author_company)
                                            <br><span> {{ $additional->author_company }}</span>
                                        @endif
                                    </div>
                                @endif
                            
                            @endforeach
                            
                            <!-- Footer -->
                            
                            @foreach($resumeData['additional']->get() as $additional)
                                
                                @if($additional->type == 'footer')
                                    <br>
                                    <div class="long-text italics">
                                        {{ $additional->content }}
                                    </div>
                                @endif
                            
                            @endforeach
                            
                        </td>
                        
                    </tr>
                </tbody>
            </table>
        </div>
        
        <!-- /pageHTML -->
        
        <script type="text/php">
            if (isset($PAGE_COUNT) && $PAGE_COUNT > 1) {
                throw new OverflowException('Resume content must fit in one page.');
            }
        </script>
    </body>
</html>
